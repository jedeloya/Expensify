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
    SINFO("TODOID: "  + request["todoID"] + " completed: " + request["completed"] + " accountID: " + request["accountID"]);
    if(request["todoID"].empty() || request["completed"].empty()) {
        response.methodLine = "400 Bad Request";
        return;
    }
    if(request["accountID"].empty()) {
        db.write(format("UPDATE todo SET completed = {} WHERE todoID = {} AND accountID IS NULL;", SQ(request["completed"]), SQ(request["todoID"]), SQ(request["accountID"])));
    } else {
        db.write(format("UPDATE todo SET completed = {} WHERE todoID = {} AND accountID = {};", SQ(request["completed"]), SQ(request["todoID"]), SQ(request["accountID"])));
    }

    SData data;
    data["todoID"] = request["todoID"];
    data["completed"] = request["completed"] == "1";
    data["accountID"] = request["accountID"];

    response.content = SComposeJSONObject(data.nameValueMap);
    response.methodLine = "200 OK";
    return;
}
