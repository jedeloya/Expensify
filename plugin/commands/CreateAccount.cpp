#include <string.h>

#include <BedrockServer.h>
#include <ToDo.h>
#include <libstuff/SQResult.h>

CreateAccount::CreateAccount(SQLiteCommand&& baseCommand, BedrockPlugin_ToDoApp* plugin) : BedrockCommand(move(baseCommand), plugin)
{
}
bool CreateAccount::peek(SQLite& db) {
    return false;
}
void CreateAccount::process(SQLite& db) {
    SINFO("name: " + request["name"] + " email: " + request["email"] + " pass: " + request["password"]);
    if(request["name"].empty() || request["email"].empty() || request["password"].empty()) {
        response.methodLine = "400 Bad Request";
        return;
    }
    SQResult results;
    const int64_t accountID = SToInt64(db.read("SELECT MAX(accountID) FROM accounts;")) + 1;

    db.write(format("INSERT INTO accounts (accountID, name, email, password) VALUES ({}, {}, {}, {});", SQ(accountID), SQ(request["name"]), SQ(request["email"]), SQ(request["password"])));

    SData data;
    data["accountID"] = to_string(accountID);
    data["name"] = request["name"];
    data["email"] = request["email"];
    response.content = SComposeJSONObject(data.nameValueMap);
    response.methodLine = "200 OK";
    return;
}