#include "GetAccount.h"
#include <string.h>
#include <BedrockServer.h>
#include <ToDo.h>
#include <libstuff/SQResult.h>
// #include <libstuff/sqlite3ext.h>

GetAccount::GetAccount(SQLiteCommand&& baseCommand, BedrockPlugin_ToDoApp* plugin) : BedrockCommand(move(baseCommand), plugin)
{
}

bool GetAccount::peek(SQLite& db) {
    return false;
}

void GetAccount::process(SQLite& db) {
    if(request["email"].empty()) {
        response.methodLine = "400 Bad Request";
        return;
    }
    SQResult data;
    db.read(format("SELECT * FROM accounts WHERE email='{}';", request["email"]), data);
    list<string> accounts;
    SINFO("data size: " + to_string(data.size()) + " rows size: " + to_string(data.rows.size()));
    for (auto& item : data.rows) {
        STable data;
        data["accountID"] = item["accountID"];
        data["email"] = item["email"];
        data["name"] = item["name"];
        data["password"] = item["password"];
        accounts.push_back(SComposeJSONObject(data));
    }
    SINFO("accounts size: " + to_string(accounts.size()) + " accounts empty: " + to_string(accounts.empty()));
    if(accounts.size() < 1) {
        SINFO("Bad user or password");
        response.methodLine = "401 Unauthorized";
        return;
    }
    // Make sure just 1 register will be back.
    if(accounts.size() > 1) {
        SINFO("More that 1 register back");
        response.methodLine = "401 Unauthorized";
        return;
    }
    response.content = SComposeJSONArray(accounts);
    response.methodLine = "200 OK";
    return;
}
