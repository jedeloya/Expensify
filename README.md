# C++ Distributed Systems Engineer Take Home Challenge

Welcome to our C++ Take Home Challenge!

To start, explaining a few things about the environment you'll execute your take-home challenge:

- All the code you'll work on is located in `/home/ubuntu/ToDoApp`
- The application structure is: 
    - A vanilla HTML/CSS/JS site, located in `/home/ubuntu/ToDoApp/site`
    - simple PHP API file, located in `/home/ubuntu/ToDoApp/site/php/api.php`
    - Bedrock plugin code, located in `/home/ubuntu/ToDoApp/plugin`
- The C++ application runs on a service called `bedrock`, so for any changes applied to it, you'll need to restart the service
- nginx is pointed to `/var/www/todo-app`, which is symlinked to `/home/ubuntu/ToDoApp/site`, so any changes executed on PHP/HTML/CSS/JS will automatically be reflected on your provisioned domain.
- To learn more about Bedrock, you can check the [github](https://github.com/Expensify/Bedrock) repository and its [website](https://bedrockdb.com/). It's also available on your home folder `/home/ubuntu/Bedrock`, but we don't expect you to do any changes to it.
    - You will find a host of useful utility functions in https://github.com/Expensify/Bedrock/tree/main/libstuff, and you are encouraged to use them as needed.
- Consider doing some kind of backup for your changes in case anything happens to your server
- You have sudo access to your server, use it wisely
- To access your server, you can use the following command: `ssh candidate@{provided_server_IP}`. The user is “candidate” and your default ssh key in GH should be enough to access the server.
- The URL for your project is `{candidate_gh}.expensify-todo.com`

#### Peek vs Process: TL;DR
While for your challenge it will be running on a single server, Bedrock is designed to run on a cluster of servers. Keeping that in mind, what do the `peek` and `process` functions of a bedrock command do? When a command is processed by bedrock, this happens:

- Request arrives to the node (let's assume it's a follower).
- peek is run if it returns true then the command is finished and response is sent back.
- if we set repeek to true, peek will be re-run again.
- If it returns false the command gets escalated to leader.
- peek is run again, if it returns true, same as above, the command is finished and the response is sent back,
- If it returns false we call the process method.
- In peek we can't write to the DB (*), only process can (since process is run on leader and leader is the only one that can write).

So, why do we have this? Mainly so that we can reduce leader's load:

- Read commands can define peek and always return true.
- Write commands that need to perform some validations, can define a peek command so if the validation does not pass they can throw and save leader some load, if the validation passes they can return false and the validation will be done again in the leader (to ensure data has not changed since the follower run it).

#### Tip: logs!
You can find lots of useful logs in `/var/log/syslog`. You've got a logger in PHP (see the `Log` class), as well as a logger in your C++ bedrock plugin (see `SINFO`). Nginx logs will also appear there, should you need them.

### Tasks

1. Create a new table in the database called `accounts`. It should contain `accountID`, `name`, `email`, and `password`.
1. Create new commands in PHP/C++ that will allow us to create new accounts and authenticate. Update the site such that, once you are signed in, the user's name appears somewhere visible on the site, and the login/signup buttons disappear.
1. Change the existing DB `todo` table to include `accountID`.
    1. To change existing tables without losing data, you can run `alter table` directly on the DB file using the `sqlite3` binary
1. Update the listing method to also list the `name` from the account that created the item. You can still list all items while unauthenticated.
1. Change the insert ToDo form to only show up when you're authenticated
1. Implement a function to complete a ToDo item. In the frontend, you should mark the item as completed when you click on the checkbox. If the item is already completed, disable the checkbox. This should update the `completed` column in the database. You can only complete items that belongs to the user logged in.


### Bonus points:

- Implement sign out
- Be creative: make it your own.

### Deliverables

Do not delete the code you wrote from the server, since we'll also grade it, but we're expecting to be able to test all functionalities you implemented directly in the URL we've provided you, so leave the application running with all the changes you've applied. 

When you're done, answer this email with the following information:

- What were the hardest steps for you
- How long it took you to complete each step


That's it! Let us know if you have any questions!

Feel free to ask anything; this is an open book test. As a reminder, this is untimed.  The challenge will serve as your introduction to the team so please, take your time and don’t hesitate to reach out to me.

Best,
