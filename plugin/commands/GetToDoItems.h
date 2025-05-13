#pragma once
#include "BedrockPlugin.h"
#include <ToDo.h>

class BedrockPlugin_ToDoApp;
class GetToDoItems : public BedrockCommand {
  public:
    GetToDoItems(SQLiteCommand&& baseCommand, BedrockPlugin_ToDoApp* plugin);
    virtual bool peek(SQLite& db);
};