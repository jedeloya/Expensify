#pragma once
#include <libstuff/libstuff.h>
#include <BedrockPlugin.h>
#include <BedrockServer.h>
#include <commands/GetToDoItems.h>
#include <commands/CreateToDoItem.h>
#include <commands/CreateAccount.h>

class GetToDoItems;
class CreateToDoItem;

class BedrockPlugin_ToDoApp : public BedrockPlugin {
  public:
    BedrockPlugin_ToDoApp(BedrockServer& s);
    virtual const string& getName() const;
    virtual unique_ptr<BedrockCommand> getCommand(SQLiteCommand&& baseCommand);
    virtual void upgradeDatabase(SQLite& db);
    static const string name;
};
