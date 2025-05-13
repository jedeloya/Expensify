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

    db.write(format("INSERT INTO todo (created, todoID, description, completed) VALUES ({}, {}, {}, 0);", SQ(STimeNow()), SQ(todoID), SQ(request["description"])));

    SData data;
    data["todoID"] = to_string(todoID);
    data["description"] = request["description"];
    response.content = SComposeJSONObject(data.nameValueMap);
    response.methodLine = "200 OK";
    return;
}
