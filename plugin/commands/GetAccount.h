#pragma once
#include "BedrockPlugin.h"
#include <ToDo.h>

class BedrockPlugin_ToDoApp;
class GetAccount : public BedrockCommand {
  public:
    GetAccount(SQLiteCommand&& baseCommand, BedrockPlugin_ToDoApp* plugin);
    virtual bool peek(SQLite& db);    
    virtual void process(SQLite& db);
};