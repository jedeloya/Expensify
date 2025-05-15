#include "CreateToDoItem.h"

#include <string.h>

#include <BedrockServer.h>
#include <ToDo.h>
#include <libstuff/SQResult.h>

CreateToDoItem::CreateToDoItem(SQLiteCommand&& baseCommand, BedrockPlugin_ToDoApp* plugin) : BedrockCommand(move(baseCommand), plugin)
{
}
bool CreateToDoItem::peek(SQLite& db) {
    return false;
}
void CreateToDoItem::process(SQLite& db) {
    if(request["description"].empty()) {
        response.methodLine = "400 Bad Request";
        return;
    }
    SQResult results;
    const int64_t todoID = SToInt64(db.read("SELECT MAX(todoID) FROM todo;")) + 1;

    if(request["accountID"].empty()) {
        db.write(format("INSERT INTO todo (created, todoID, description, completed) VALUES ({}, {}, {}, 0);", SQ(STimeNow()), SQ(todoID), SQ(request["description"])));
    } else {
        db.write(format("INSERT INTO todo (created, todoID, description, completed, accountID) VALUES ({}, {}, {}, 0, {});", SQ(STimeNow()), SQ(todoID), SQ(request["description"]), SQ(request["accountID"])));
    }

    SQResult data;
    db.read(format("SELECT todo.*, accounts.name FROM todo LEFT JOIN accounts on todo.accountID = accounts.accountID WHERE todoID = {};", todoID), data);

    list<string> todoItems;
    for (auto& item : data.rows) {
        SData data;
        data["created"] = item["created"];
        data["todoID"] = item["todoID"];
        data["description"] = item["description"];
        data["completed"] = item["completed"] == "1";
        data["accountID"] = item["accountID"];
        data["userName"] = item["name"];
        std::string jsondata = SComposeJSONObject(data.nameValueMap);
        SINFO("todo data: " + jsondata);
        todoItems.push_back(jsondata);
    }
    response.content = todoItems.back();
    response.methodLine = "200 OK";
    return;
}
