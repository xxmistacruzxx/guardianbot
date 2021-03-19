/**
 * Guardian Discord Bot
 * An administrative bot
 * @ xxmistacruzxx
 * Started 9/19/19
 */

const Discord = require('discord.js');
const Guardian = new Discord.Client();

const token = '';

const PREFIX = '`';
const fs = require("fs");
Guardian.settings = require("./settings.json");
Guardian.servers = require("./servers.json");
let Guardianowner;

// Bot Online Detector
Guardian.on('ready', () => {
    Guardian.user.setActivity(Guardian.settings['persistent'].activity, { type: Guardian.settings['persistent'].activitytype });
    console.log('This bot is online!');
    Guardian.fetchUser('').then(myUser => {
        console.log(myUser.avatarURL); // My user's avatar is here!
        Guardianowner = myUser;
    });
});


// Enter Detector
Guardian.on('guildMemberAdd', member => {
    // Welcome message
    const channel = member.guild.channels.find(channel => channel.name === Guardian.servers[channel.guild.name]['join-leave']);
    if (channel !== null) {
        channel.send(`Welcome to ` + member.guild.name + `, ${member}!`);
    }

    // Autoenter
    if (Guardian.servers[member.guild.name]['autoenter'] = 1 && Guardian.servers[member.guild.name]['enter-role'] !== null) {
        let memberRole = member.guild.roles.find("name", Guardian.servers[member.guild]['enter-role']);
        member.addRole(memberRole);
    } else {
        member.send(`Hello ${member}, to gain access to the server, please type ` + PREFIX + `enter in the designated entry chat and acquire default perms.`);
    }
})


// Exit Detector
Guardian.on('guildMemberRemove', member => {
    const channel = member.guild.channels.find(channel => channel.name === Guardian.servers[channel.guild.name]['join-leave']);
    if (!channel) return;

    channel.send(`${member} has left the server.`);
})

// Message Detector
Guardian.on('message', msg => {

    let args = msg.content.substring(PREFIX.length).split(" ");
    if (msg.content.substring(0, 1) !== '`') return;
    // Commands
    switch (args[0]) {
        // test commands
        case 'ping':
            msg.reply('pong!');
            break;

        // List commands
        case 'help':
            let directory;
            if (args[1] === 'here') {
                directory = msg.channel;
            } else {
                directory = msg.member;
            }
            directory.send({
                embed: {
                    color: 3447003,
                    author: {
                        name: Guardian.user.username + ' by ' + Guardianowner.username,
                        icon_url: Guardian.user.avatarURL
                    },
                    title: "Click Here to Join XxMistaCruzxX's Server 'Yuh'",
                    url: "http://discord.com/jEWHJcZ",
                    description: "Guardian Bot is an administrative bot designed to make features that should be in discord by default.",
                    fields: [{
                        name: "**Command List**",
                        value: "⬇️⬇️⬇️⬇️",
                    }, {
                        name: "Help - Lists commands",
                        value: "`help [here]"
                    }, {
                        name: "Ping - Tests whether bot is online",
                        value: "`ping"
                    }, {
                        name: "Presence - Change the activity of Guardian [BOT OWNER ONLY]",
                        value: "`presence <activtytype> <text>"
                    }, {
                        name: "Clear - Clears messages in chat [ADMINISTATOR OR MANAGE MESSAGES]",
                        value: "`clear <#ofmsgs>"
                    }, {
                        name: "Initialize - Clears all server info from bot database \(Should be done at the start of use\) [ADMINISTATOR]",
                        value: "`initialize"
                    }, {
                        name: "Listserverinfo - Shows all server info from database [ADMINISTATOR]",
                        value: "`listserverinfo"
                    }, {
                        name: "Setenter-role - Sets the role in which every user should have in a server [ADMINISTATOR]",
                        value: "`setenter-role"
                    }, {
                        name: "Enter - Gives the assigned enter-role to user",
                        value: "`enter"
                    }, {
                        name: "Autoenter - Toggles automatic enter-role assignment on user join [ADMINISTRATOR]",
                        value: "`autoenter"
                    }, {
                        name: "Request-role - Allows a user to obtain roles set requestable by the server owner",
                        value: "`request-role <rolename>"
                    }, {
                        name: "setjoin-leave - Sets the channel where the bot notifies a user leaving or joining the server",
                        value: "`setjoin-leave"
                    }, {
                        name: "Setrole-chat - Sets the channel where a user can request roles [ADMINISTATOR]",
                        value: "`setrole-chat"
                    }, {
                        name: "Addrequest-role - Adds a requestable role [ADMINISTATOR]",
                        value: "`addrequest-role <rolename>"
                    }, {
                        name: "Deleterequest-role - Deletes a requestable role [ADMINISTATOR]",
                        value: "`deleterequest-role <rolename>"
                    }, {
                        name: "Createkey - Creates a key and manager role that people can be assigned to have permisions for channels [ADMINISTRATOR]",
                        value: "`createkey <keyname>"
                    }, {
                        name: "Deletekey - Deletes a key and manager rank [ADMINISTRATOR]",
                        value: "`deletekey <keyname>"
                    }, {
                        name: "Givekey - Allows a manager to assign their key to a user",
                        value: "`givekey <keyname> <username>"
                    }, 
                    ],
                    timestamp: new Date(),
                    footer: {
                        icon_url: Guardianowner.avatarURL,
                        text: "© XxMistaCruzxX"
                    }
                }
            });
            msg.delete();
            break;

        // Change the activity of the bot
        case 'presence':
            if (msg.author.id == '209771327966412801') {
                if (!args[2]) {
                    msg.reply('`presence <type> <content>')
                } else {
                    // Playing Presence
                    if (args[1] === "playing") {
                        Guardian.user.setActivity(msg.content.slice(18), { type: "PLAYING" });
                        Guardian.settings['persistent'] = {
                            activity: msg.content.slice(18),
                            activitytype: 'PLAYING'
                        }
                        fs.writeFile("./settings.json", JSON.stringify(Guardian.settings, null, 4), err => {
                            if (err) throw err;
                            msg.channel.send("Activity updated.");
                        })
                    }
                    // Listening Presence
                    if (args[1] === "listening") {
                        Guardian.user.setActivity(msg.content.slice(20), { type: "LISTENING" });
                        Guardian.settings['persistent'] = {
                            activity: msg.content.slice(20),
                            activitytype: 'LISTENING'
                        }
                        fs.writeFile("./settings.json", JSON.stringify(Guardian.settings, null, 4), err => {
                            if (err) throw err;
                            msg.channel.send("Activity updated.");
                        })
                    }
                    // Streaming Presence
                    if (args[1] === "streaming") {
                        Guardian.user.setActivity(msg.content.slice(20), { type: "STREAMING" });
                        Guardian.settings['persistent'] = {
                            activity: msg.content.slice(20),
                            activitytype: 'STREAMING'
                        }
                        fs.writeFile("./settings.json", JSON.stringify(Guardian.settings, null, 4), err => {
                            if (err) throw err;
                            msg.channel.send("Activity updated.");
                        })
                    }
                    // Watching Presence
                    if (args[1] === "watching") {
                        Guardian.user.setActivity(msg.content.slice(19), { type: "WATCHING" });
                        Guardian.settings['persistent'] = {
                            activity: msg.content.slice(19),
                            activitytype: 'WATCHING'
                        }
                        fs.writeFile("./settings.json", JSON.stringify(Guardian.settings, null, 4), err => {
                            if (err) throw err;
                            msg.channel.send("Activity updated.");
                        })
                    }
                }
            } else {
                msg.reply('You are a mere mortal.');
            }
            console.log(msg.author.id);
            msg.delete(1000);
            break;


        // Clear messages for admins
        case 'clear':
            if (msg.member.permissions.has("MANAGE_MESSAGES", checkAdmin = true) === true) {
                let t = parseInt(args[1]);
                if (!args[1] || !t) return msg.reply('`clear <#ofmsgs>');
                else {
                    msg.channel.bulkDelete((args[1]));
                }
            } else {
                msg.delete(1000);
                msg.channel.send(msg.member.user + ' tried to use \'\`clear,\' but they are not an ADMINISTRATOR or have permission MANAGE_MESSAGES.');
            }
            break;


        // Command for user to request default roles
        case 'enter':
            if (!msg.guild) {
                msg.channel.send('You are not in a server.');
            } else {
                if (!Guardian.servers[msg.guild.name]) {
                    msg.reply("please have an administrator initialize the server.");
                } else {
                    if (Guardian.servers[msg.guild.name]['enter-role'] == null) {
                        msg.reply("no enter-rank has been assigned for this server.");
                    } else {
                        if (msg.channel.name !== Guardian.servers[msg.guild]['role-chat']) {
                            msg.reply('Please use the chat named : ' + Guardian.servers[msg.guild]['role-chat']);
                        } else {
                            if (msg.channel.name === Guardian.servers[msg.guild]['role-chat']) {
                                let memberRole = msg.member.guild.roles.find("name", Guardian.servers[msg.guild]['enter-role']);
                                msg.member.addRole(memberRole);
                                msg.channel.send(msg.member.user + " has been assigned " + Guardian.servers[msg.guild]['enter-role']);
                            }
                        }
                    }
                }
            }
            msg.delete(1000);
            break;


        // Command run by server owner to register persistence for the server.
        case 'initialize':
            if (!msg.guild) {
                msg.channel.send('You are not in a server.');
            } else {
                if (!Guardian.servers[msg.guild.name]) {
                    msg.reply("Please have an administrator initialize the server.");
                } else {
                    if (msg.member.permissions.has("ADMINISTRATOR", checkAdmin = true) === true) {
                        Guardian.servers[msg.guild] = {
                            'join-leave': null,
                            'enter-role': null,
                            'request-roles': {},
                            'keys': {},
                            'role-chat': null,
                            'autoenter': 1,
                            'autonickname': {},
                        }
                        fs.writeFile("./servers.json", JSON.stringify(Guardian.servers, null, 4), err => {
                            if (err) throw err;
                            msg.channel.send(msg.member.user + " initialized the server.");
                        })
                    } else {
                        msg.channel.send(msg.member.user + ' tried to use \'\`initialize,\' but they are not an ADMINISTRATOR.');
                    }
                }
            }
            msg.delete(1000);
            break;


        // set join-leave channel for server
        case 'setjoin-leave':
            if (!msg.guild) {
                msg.channel.send('You are not in a server.');
            } else {
                if (!Guardian.servers[msg.guild.name]) {
                    msg.reply("please have an administrator initialize the server.");
                } else {
                    if (msg.member.permissions.has("ADMINISTRATOR", checkAdmin = true) === true) {
                        if (!args[1]) {
                            Guardian.servers[msg.guild]['join-leave'] = msg.channel.name;
                            fs.writeFile("./servers.json", JSON.stringify(Guardian.servers, null, 4), err => {
                                if (err) throw err;
                                msg.channel.send(msg.member.user + ' set the join-leave channel to ' + Guardian.servers[msg.guild]['join-leave'] + '.');
                            })
                        } else {
                            Guardian.servers[msg.guild]['join-leave'] = msg.content.slice(15);
                            fs.writeFile("./servers.json", JSON.stringify(Guardian.servers, null, 4), err => {
                                if (err) throw err;
                                msg.channel.send(msg.member.user + ' set the join-leave channel to ' + Guardian.servers[msg.guild]['join-leave'] + '.');
                            })
                        }
                    } else {
                        msg.channel.send(msg.member.user + ' tried to use \'\`setjoin-leave,\' but they are not an ADMINISTRATOR.');
                    }
                }
            }
            msg.delete(1000);
            break;


        // set role chat
        case 'setrole-chat':
            if (!msg.guild) {
                msg.channel.send('You are not in a server.');
            } else {
                if (!Guardian.servers[msg.guild.name]) {
                    msg.reply("please have an administrator initialize the server.");
                } else {
                    if (msg.member.permissions.has("ADMINISTRATOR", checkAdmin = true) === true) {
                        if (!args[1]) {
                            Guardian.servers[msg.guild]['role-chat'] = msg.channel.name;
                            fs.writeFile("./servers.json", JSON.stringify(Guardian.servers, null, 4), err => {
                                if (err) throw err;
                                msg.channel.send(msg.member.user + ' set the role-chat channel to ' + Guardian.servers[msg.guild]['role-chat'] + '.');
                            })
                        } else {
                            Guardian.servers[msg.guild]['role-chat'] = msg.content.slice(14);
                            fs.writeFile("./servers.json", JSON.stringify(Guardian.servers, null, 4), err => {
                                if (err) throw err;
                                msg.channel.send(msg.member.user + ' set the role-chat channel to ' + Guardian.servers[msg.guild]['role-chat'] + '.');
                            })
                        }
                    } else {
                        msg.channel.send(msg.member.user + ' tried to use \'\`setrole-chat,\' but they are not an ADMINISTRATOR.');
                    }
                }
            }
            msg.delete(1000);
            break;


        // set enter role
        case 'setenter-role':
            if (!msg.guild) {
                msg.channel.send('You are not in a server.');
            } else {
                if (!Guardian.servers[msg.guild.name]) {
                    msg.reply("please have an administrator initialize the server.");
                } else {
                    if (msg.member.permissions.has("ADMINISTRATOR", checkAdmin = true) === true) {
                        if (!args[1]) {
                            msg.channel.send(msg.member.user + ', missing arg[1], `setenter-role <rolename>');
                        } else {
                            Guardian.servers[msg.guild]['enter-role'] = msg.content.slice(15);
                            fs.writeFile("./servers.json", JSON.stringify(Guardian.servers, null, 4), err => {
                                if (err) throw err;
                                msg.channel.send(msg.member.user + ' set the enter-role to ' + Guardian.servers[msg.guild]['enter-role'] + '.');
                            })
                        }
                    } else {
                        msg.channel.send(msg.member.user + ' tried to use \'\`setenter-role,\' but they are not an ADMINISTRATOR.');
                    }
                }
            }
            msg.delete(1000);
            break;


        // add request role
        case 'addrequest-role':
            if (!msg.guild) {
                msg.channel.send('You are not in a server.');
            } else {
                if (!Guardian.servers[msg.guild.name]) {
                    msg.reply("please have an administrator initialize the server.");
                } else {
                    if (msg.member.permissions.has("ADMINISTRATOR", checkAdmin = true) === true) {
                        Guardian.servers[msg.guild.name]['request-roles'][args[1]] = args[1];
                        fs.writeFile("./servers.json", JSON.stringify(Guardian.servers, null, 4), err => {
                            if (err) throw err;
                            msg.channel.send(msg.member.user + ' has set ' + args[1] + ' as a requestable rank.');
                        })
                    } else {
                        msg.channel.send(msg.member.user + ' tried to use \'\`addrequest-role,\' but they are not an ADMINISTRATOR.');
                    }
                }
            }
            msg.delete(1000);
            break;


        // delete request role
        case 'deleterequest-role':
            if (!msg.guild) {
                msg.channel.send('You are not in a server.');
            } else {
                if (!Guardian.servers[msg.guild.name]) {
                    msg.reply("please have an administrator initialize the server.");
                } else {
                    if (msg.member.permissions.has("ADMINISTRATOR", checkAdmin = true) === true) {
                        delete Guardian.servers[msg.guild]['request-roles'][args[1]];
                        fs.writeFile("./servers.json", JSON.stringify(Guardian.servers, null, 4), err => {
                            if (err) throw err;
                            msg.channel.send(msg.member.user + ' has deleted ' + args[1] + ' as a requestable rank.');
                        })
                    } else {
                        msg.channel.send(msg.member.user + ' tried to use \'\`deleterequest-role,\' but they are not an ADMINISTRATOR.');
                    }
                }
            }
            msg.delete(1000);
            break;


        // Request request roles
        case 'request-role':
            if (!msg.guild) {
                msg.channel.send('You are not in a server.');
            } else {
                if (!Guardian.servers[msg.guild.name]) {
                    msg.reply("please have an administrator initialize the server.");
                } else {
                    if (msg.channel.name !== Guardian.servers[msg.guild]['role-chat'] && Guardian.servers[msg.guild]['role-chat'] !== null) {
                        msg.reply('Please use the chat named : ' + Guardian.servers[msg.guild]['role-chat']);
                    } else {
                        if (!Guardian.servers[msg.guild]['request-roles'][args[1]]) {
                            msg.channel.send("Sorry, " + msg.member.user + ", but there is either a spelling error or that role is not requestable.");
                        } else {
                            let memberRole = msg.member.guild.roles.find("name", Guardian.servers[msg.guild]['request-roles'][args[1]]);
                            msg.member.addRole(memberRole);
                            msg.channel.send(msg.member.user + " has been assigned " + args[1]);
                        }
                    }
                }
            }
            msg.delete(1000);
            break;


        // Toggle autoenter
        case 'autoenter':
            if (!msg.guild) {
                msg.channel.send('You are not in a server.');
            } else {
                if (!Guardian.servers[msg.guild.name]) {
                    msg.reply("please have an administrator initialize the server.");
                } else {
                    if (msg.member.permissions.has("ADMINISTRATOR", checkAdmin = true) === true) {
                        if (Guardian.servers[msg.guild.name]['autoenter'] != 1) {
                            Guardian.servers[msg.guild.name]['autoenter'] = 1;
                            fs.writeFile("./servers.json", JSON.stringify(Guardian.servers, null, 4), err => {
                                if (err) throw err;
                                msg.channel.send('Autoenter has been set to 1.');
                            })
                        } else {
                            Guardian.servers[msg.guild.name]['autoenter'] = 0;
                            fs.writeFile("./servers.json", JSON.stringify(Guardian.servers, null, 4), err => {
                                if (err) throw err;
                                msg.channel.send('Autoenter has been set to 0.');
                            })
                        }
                    } else {
                        msg.channel.send(msg.member.user + ' tried to use \'\`autoenter,\' but they are not an ADMINISTRATOR.');
                    }
                }
            }
            msg.delete(1000);
            break;


        // creates key in servers.json, the role, and rolemanager in guild.
        case 'createkey':
            if (!msg.guild) {
                msg.channel.send('You are not in a server.');
            } else {
                if (!Guardian.servers[msg.guild.name]) {
                    msg.reply("please have an administrator initialize the server.");
                } else {
                    if (msg.member.permissions.has("ADMINISTRATOR", checkAdmin = true) === true) {
                        if (!Guardian.servers[msg.guild.name]['keys']) {
                            Guardian.servers[msg.guild.name]['keys'] = {};
                        }
                        Guardian.servers[msg.guild.name]['keys'][args[1]] = args[1];
                        fs.writeFile("./servers.json", JSON.stringify(Guardian.servers, null, 4), err => {
                            if (err) throw err;
                            msg.guild.createRole({
                                name: args[1],
                                color: 'WHITE',
                            });
                            msg.guild.createRole({
                                name: args[1] + 'Manager',
                                color: 'WHITE',
                            });
                            msg.channel.send(msg.member.user + ' has set ' + args[1] + ' as a key.');
                        })
                    } else {
                        msg.channel.send(msg.member.user + ' tried to use \'\`createkey,\' but they are not an ADMINISTRATOR.');
                    }
                }
            }
            msg.delete(1000);
            break;


        // deletes key in servers.json, deletes both role and rolemanager in guild
        case 'deletekey':
            if (!msg.guild) {
                msg.channel.send('You are not in a server.');
            } else {
                if (!Guardian.servers[msg.guild.name]) {
                    msg.reply("please have an administrator initialize the server.");
                } else {
                    if (msg.member.permissions.has("ADMINISTRATOR", checkAdmin = true) === true) {
                        if (!Guardian.servers[msg.guild.name]['keys']) {
                            Guardian.servers[msg.guild.name]['keys'] = {};
                            fs.writeFile("./servers.json", JSON.stringify(Guardian.servers, null, 4));
                        }
                        if (!Guardian.servers[msg.guild.name]['keys'][args[1]]) {
                            msg.reply("that key does not exist.");
                        } else {
                            delete Guardian.servers[msg.guild.name]['keys'][args[1]];
                            fs.writeFile("./servers.json", JSON.stringify(Guardian.servers, null, 4), err => {
                                if (err) throw err;
                                msg.guild.roles.find('name', args[1]).delete();
                                msg.guild.roles.find('name', args[1] + 'Manager').delete();
                                msg.channel.send(msg.member.user + ' has deleted the ' + args[1] + ' key.');
                            })
                        }
                    } else {
                        msg.channel.send(msg.member.user + ' tried to use \'\`createkey,\' but they are not an ADMINISTRATOR.');
                    }
                }
            }
            msg.delete(1000);
            break;

        // lets a user with the manager role give a key to another user
        case 'givekey':
            if (!msg.guild) {
                msg.channel.send('You are not in a server.');
            } else {
                if (!Guardian.servers[msg.guild.name]) {
                    msg.reply("please have an administrator initialize the server.");
                } else {
                    if (msg.member.roles.find(r => r.name === args[1] + 'Manager')) {
                        let memberRole = msg.member.guild.roles.find("name", args[1]);
                        let u = Guardian.users.find("username", args[2]);
                        let m = msg.guild.members.find("user", u);
                        m.addRole(memberRole);
                        msg.channel.send(msg.member.user + ' has given ' + u + ' the ' + args[1] + ' key.');
                    } else {
                        if (!Guardian.servers[msg.guild]['keys'][args[1]]) {
                            msg.reply('that key does not exist.');
                        } else {
                            msg.channel.send(msg.member.user + ' tried to use \'\`givekey,\' but they are not the manager of the ' + args[1] + " key.");
                        }
                    }
                }
            }


            msg.delete(1000);
            break;

        // Lets an administrator of a server look at what settings are stored
        case 'listserverinfo':
            if (!msg.guild) {
                msg.channel.send('You are not in a server.');
            } else {
                if (!Guardian.servers[msg.guild.name]) {
                    msg.reply("please have an administrator initialize the server.");
                } else {
                    if (msg.member.permissions.has("ADMINISTRATOR", checkAdmin = true) === true) {
                        var temp = JSON.stringify(Guardian.servers[msg.guild]);
                        for (var i = 0; i < temp.length; i++) {
                            if (temp.charAt(i) == ',') {
                                var before = temp.substring(0,i+1);
                                var after = temp.substring(i+1,temp.length);
                                temp = before + "\n" + after;
                            }
                        }
                        msg.member.send("Server info for " + msg.guild + ".\n```" + temp + "```");
                    } else {
                        msg.channel.send(msg.member.user + ' tried to use \'\`listserverinfo,\' but they are not an ADMINISTRATOR.');
                    }
                }
            }
            msg.delete(1000);
            break;

            // Allows an administrator have a user be repeatedly nicknamed
            case 'addautonickname':
            if (!msg.guild) {
                msg.channel.send('You are not in a server.');
            } else {
                if (!Guardian.servers[msg.guild.name]) {
                    msg.reply("please have an administrator initialize the server.");
                } else {
                    if (msg.member.permissions.has("ADMINISTRATOR", checkAdmin = true) === true) {
                        let u = Guardian.users.find("username", args[1]);
                        let m = msg.guild.members.find("user", u);
                        if (u == null) {
                            msg.channel.send("Could not find user.");
                            break;
                        }
                        Guardian.servers[msg.guild.name]['autonickname'][u] = args[2];
                        fs.writeFile("./servers.json", JSON.stringify(Guardian.servers, null, 4), err => {
                            if (err) throw err;
                            msg.channel.send(msg.member.user + ' has locked the user ' + u + ' with the name ' + args[2] + '.');
                        })
                        console.log("no crash");
                    } else {
                        msg.channel.send(msg.member.user + ' tried to use \'\`addrequest-role,\' but they are not an ADMINISTRATOR.');
                    }
                }
            }
            msg.delete(1000);
            break;
    }
});

Guardian.login(token);
