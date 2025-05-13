#pragma once
#include "BedrockPlugin.h"
#include <ToDo.h>

class BedrockPlugin_ToDoApp;
class CreateToDoItem : public BedrockCommand {
  public:
    CreateToDoItem(SQLiteCommand&& baseCommand, BedrockPlugin_ToDoApp* plugin);
    virtual bool peek(SQLite& db);    
    virtual void process(SQLite& db);
};