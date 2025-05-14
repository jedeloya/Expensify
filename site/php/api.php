<?php

declare(strict_types=1);

require __DIR__ . '/vendor/autoload.php';
use Expensify\Bedrock\Client;
use Expensify\Todo\Log;
use Monolog\Logger;
use Monolog\Handler\SyslogHandler;

session_start();

// Set the header to always return JSON
header('Content-Type: application/json');

function callBedrock(string $method, array $data = []): array {
    $pluginLogger = new Logger("ToDoApp-plugin");
    $pluginSyslogHandler = new SyslogHandler("todo-app-plugin");
    $pluginLogger->pushHandler($pluginSyslogHandler);
    $client = Client::getInstance([
        'clusterName' => 'todo',
        'mainHostConfigs' => ['127.0.0.1' => ['port' => 8888]],
        'failoverHostConfigs' => ['127.0.0.1' => ['port' => 8888]],
        'connectionTimeout' => 1,
        'readTimeout' => 300,
        'maxBlackListTimeout' => 60,
        'logger' => $pluginLogger,
        'commandPriority' => Client::PRIORITY_NORMAL,
        'bedrockTimeout' => 300,
        'writeConsistency' => 'ASYNC',
        'logParam' =>  null,
        'stats' => null,
    ]);

    try {
        Log::info("Calling bedrock method $method");
        $response = $client->call($method, $data);
        if ($response["code"] == 200) {
            return $response['body'];    
        } else {
            Log::error('Received error response from bedrock: '.$response['codeLine']);

            // Try to parse status code from error message
            $statusCode = intval($response['codeLine']);
            Log::error('Got status code: '.$statusCode);
            if ($statusCode > 0) {
                http_response_code($statusCode);
            }

            return ['error' => $response['codeLine']];
        }
        return $response['body'];
    } catch (BedrockError $exception) {
        return ["error" => "Error connecting to Bedrock", "ex" => $exception];
    }
    return [];
}

$command = $_REQUEST['command'] ?? null;
Log::info("Processing API command: $command");

switch ($command) {
    case 'CreateToDoItem':
        if(!isset($_POST["description"])) {
            echo json_encode(["error" => "Mising description"]);
            return;
        }
        echo json_encode(callBedrock("CreateToDoItem", ["description" => $_POST["description"]]));
        break;
    case 'GetToDoItems':
        echo json_encode(callBedrock("GetToDoItems"));
        break;
    case 'CreateAccount':
        echo json_encode(callBedrock("CreateAccount", ["name"=>$_POST["name"], "email"=>$_POST["email"], "password"=>password_hash($_POST["password"], PASSWORD_DEFAULT)]));
        break;
    case 'GetAccount':
        $result = callBedrock("GetAccount", ["email"=>$_POST["email"]]);
        $user = $result[0];
        Log::info("result:".json_encode($result));
        Log::info("password: ".$_POST["password"]." hash password:".$user["password"]);
        if(!password_verify($_POST["password"], $user["password"])) {
            echo json_encode(["error"=>"Bad user name or password"]);
            break;
        }
        unset($user["password"]);
        Log::info("After delete passwordresult:".json_encode($user));
        echo json_encode($user);
        break;
    default:
        http_response_code(404);
        echo json_encode(['error' => "unknown command $command"]);
}

