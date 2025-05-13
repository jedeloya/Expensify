#include "ToDo.h"

#include <string.h>

#include <BedrockServer.h>
#include <libstuff/SQResult.h>

#undef SLOGPREFIX
#define SLOGPREFIX "{" << getName() << "} "

const string BedrockPlugin_ToDoApp::name("ToDoApp");
const string& BedrockPlugin_ToDoApp::getName() const {
    return name;
}

// Expose the appropriate function from our shared lib so bedrock can load it. All it has to do is create an instance
// of an auth plugin, the base class constructor will handle the rest.
extern "C" BedrockPlugin_ToDoApp* BEDROCK_PLUGIN_REGISTER_TODOAPP(BedrockServer& s)
{
    return new BedrockPlugin_ToDoApp(s);
}

BedrockPlugin_ToDoApp::BedrockPlugin_ToDoApp(BedrockServer& s) : BedrockPlugin(s)
{
}

unique_ptr<BedrockCommand> BedrockPlugin_ToDoApp::getCommand(SQLiteCommand&& baseCommand) {
    if (SStartsWith(SToLower(baseCommand.request.methodLine), "gettodoitems")) {
        return make_unique<GetToDoItems>(move(baseCommand), this);
    } else if (SStartsWith(SToLower(baseCommand.request.methodLine), "createtodoitem")) {
        return make_unique<CreateToDoItem>(move(baseCommand), this);
    } else if (SStartsWith(SToLower(baseCommand.request.methodLine), "createaccount")) {
        return make_unique<CreateAccount>(move(baseCommand), this);
    }
    return nullptr;
}

void BedrockPlugin_ToDoApp::upgradeDatabase(SQLite& db) {
    bool ignore;
    SASSERT(
        db.verifyTable(
            "todo",
            "CREATE TABLE todo (created TIMESTAMP NOT NULL, todoID INTEGER NOT NULL PRIMARY KEY, description TEXT NOT NULL, completed INTEGER NOT NULL, accountID INTEGER)",
            ignore
        )
    );
    SASSERT(
        db.verifyTable(
            "accounts",
            "CREATE TABLE accounts (accountID INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL)",
            ignore
        )
    );
    SASSERT(
        db.verifyIndex(
            "idx_accounts_email",
            "accounts",
            "CREATE UNIQUE INDEX idx_accounts_email ON accounts(email)",
            true
        )
    );
}
