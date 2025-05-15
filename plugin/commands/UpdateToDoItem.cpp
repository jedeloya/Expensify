#include "UpdateToDoItem.h"

#include <string.h>

#include <BedrockServer.h>
#include <ToDo.h>
#include <libstuff/SQResult.h>

UpdateToDoItem::UpdateToDoItem(SQLiteCommand&& baseCommand, BedrockPlugin_ToDoApp* plugin) : BedrockCommand(move(baseCommand), plugin)
{
}
bool UpdateToDoItem::peek(SQLite& db) {
    return false;
}
void UpdateToDoItem::process(SQLite& db) {
    if(request["todoID"].empty() || request["completed"].empty() || request["accountID"].empty()) {
        response.methodLine = "400 Bad Request";
        return;
    }
    db.write(format("UPDATE todo SET completed = {} WHERE todoID = {} AND accountID = {};", SQ(request["completed"]), SQ(request["todoID"]), SQ(request["accountID"])));

    SData data;
    data["todoID"] = request["todoID"];
    data["completed"] = request["completed"] == "1";
    data["accountID"] = request["accountID"];

    response.content = SComposeJSONObject(data.nameValueMap);
    response.methodLine = "200 OK";
    return;
}
