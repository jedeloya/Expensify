#include "GetToDoItems.h"
#include <string.h>
#include <BedrockServer.h>
#include <ToDo.h>
#include <libstuff/SQResult.h>

GetToDoItems::GetToDoItems(SQLiteCommand&& baseCommand, BedrockPlugin_ToDoApp* plugin) : BedrockCommand(move(baseCommand), plugin)
{
}

bool GetToDoItems::peek(SQLite& db) {
    SQResult data;
    db.read("SELECT todo.*, accounts.name FROM todo LEFT JOIN accounts on todo.accountID = accounts.accountID;", data);
    list<string> todoItems;
    for (auto& item : data.rows) {
        STable data;
        data["created"] = item["created"];
        data["todoID"] = item["todoID"];
        data["description"] = item["description"];
        data["completed"] = item["completed"] == "1";
        data["accountID"] = item["accountID"];
        data["userName"] = item["name"];
        std::string jsondata = SComposeJSONObject(data);
        SINFO("data: " + jsondata);
        todoItems.push_back(SComposeJSONObject(data));
    }
    response.content = SComposeJSONArray(todoItems);
    response.methodLine = "200 OK";
    return true;
}
