<?php

declare(strict_types=1);

namespace Expensify\Todo;

use Monolog\Logger;
use Monolog\Handler\SyslogHandler;

class Log {
    private static ?Logger $instance = null;

    private static function getInstance(): Logger {
        if (self::$instance === null) {
            self::$instance = new Logger("ToDoApp-php");
            $syslogHandler = new SyslogHandler("todo-app-php");
            self::$instance->pushHandler($syslogHandler);
        }
        return self::$instance;
    }

    public static function debug(string $message): void {
        self::getInstance()->debug($message);
    }

    public static function info(string $message): void {
        self::getInstance()->info($message);
    }

    public static function warn(string $message): void {
        self::getInstance()->warn($message);
    }

    public static function error(string $message): void {
        self::getInstance()->error($message);
    }
}

