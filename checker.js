/* Copyright 2015, All Rights Reserved. */
var checkTimeout = 5000,
    checkDelay = 100,
    showIPPort = true,
    showConnection = true,
    clickToRefresh = false,
    fixPing = true,
    selected = "Main",
    subSelection = "",
    processing = 0,
    hash = window.location.hash.split('-'),
    alreadyProcessed = [],
    rendered = 0,
    loadingTimers = [],
    loadingArr = [{
        loading: true,
        unknown: true
    }],
    clockTicking = false;

if (hash.length) {
    switch (hash[0]) {
        case "#EMS":
        case "#GMS":
            //case "#JMS":
        case "#KMS":
        case "#MSEA":
		case "#THMS":
            selected = hash[0].replace('#', '');
            break;
        default:
            break;
    }
}

if (hash.length > 1) {
    subSelection = hash[1];
} else {
    subSelection = GetDefaultSubSelectionForVersion(selected);
}

function ping(ip, callback) {
    if (!this.inUse) {
        this.status = 'unchecked';
        this.inUse = true;
        this.callback = callback;
        this.ip = ip;
        this.start = 0;
        var _that = this;
        this.img = new Image();
        this.img.onload = function(e) {
            window.clearInterval(_that.timer);
            _that.inUse = false;
            _that.callback('responded', +(new Date()) - _that.start);
            if (--processing == 0)
                if (window.stop) {
                    window.stop();
                } else if (document.execCommand) {
                document.execCommand('Stop');
            };
        };
        this.img.onerror = function(e, error, errorThrown) {
            if (_that.inUse) {
                window.clearInterval(_that.timer);
                _that.inUse = false;
                _that.callback('responded', +(new Date()) - _that.start, e);
                if (--processing == 0)
                    if (window.stop) {
                        window.stop();
                    } else if (document.execCommand) {
                    document.execCommand('Stop');
                };
                return true;
            }
        };
        this.start = +(new Date());
        this.img.src = "http://" + ip + "/?cachebreaker=" + (+(new Date()));
        this.timer = setTimeout(function() {
            if (_that.inUse) {
                _that.inUse = false;
                _that.callback('timeout', false);
                if (--processing == 0)
                    if (window.stop) {
                        window.stop();
                    } else if (document.execCommand) {
                    document.execCommand('Stop');
                };
            }
        }, GetCheckTimeout());
    }
}

var PingModel = function(servers) {
    var addr = servers[0].address;

    // Hacky, for some reason the foreach binding fires twice.
    if (!(servers[0].name == 'Self') && alreadyProcessed.indexOf(addr) == -1) {
        alreadyProcessed.push(servers[0].address);
        return;
    }

    var serversArr = [];

    var x = servers;

    for (var i = 0; i < servers.length; i++)
        for (var j = 0; j < servers[i].length; j++)
            serversArr.push(servers[i][j]);

    var self = this;
    var myServers = [];
    var offset = 1;
    ko.utils.arrayForEach(serversArr, function(server) {
        if (!server.isMapleStoryGameServer || server.rel == subSelection || (server.rel == "Login" && (selected != 'GMS' && selected != 'MSEA'))) {
            myServers.push({
                icon: server.icon,
                name: server.name,
                sub: server.sub || false,
                interval: server.interval || false,
                address: server.address,
                port: server.port,
                unknown: server.unknown || false,
                status: ko.observable('unchecked'),
                time: ko.observable(""),
                values: ko.observableArray(),
                rel: server.rel
            });
        }
    });

    self.servers = ko.observableArray(myServers);
    processing += self.servers().length;
    ko.utils.arrayForEach(self.servers(), function(s) {
        s.status('checking');

        function doPing() {
            /*
            new ping(s.address + ":" + s.port, function(status, time, e) {
                s.status(status);
                s.time(time);
                s.values.push(time);
                if (s.name == "Self") {
                    SetPingOffset(time);
                }
                console.clear();
            });
            */
           s.status('checked')
           s.time('100')
           s.values.push('100')
        }
        setTimeout(function() {
            doPing();
        }, checkDelay * offset++)
    });
};

var GameServer = function(version, timeOffset, icons, servers) {
    return {
        name: "Game Servers",
        description: "These are the MapleStory " + version + " game servers.",
        selectedServers: ko.observable(loadingArr),
        icons: icons,
        timeOffset: timeOffset,
        content: function() {
            return new PingModel(servers)
        }
    }
}

var servers = {
    EMS: {
        Login: [{
            icon: "Mushroom.png",
            name: "Login",
            address: "18.196.14.103", // Verified as of 2020-06-10
            port: "8484",
            interval: 5000,
            values: [],
            isMapleStoryGameServer: true,
            rel: "Login"
        }],
        Luna: [{
                icon: "Luna.png",
                name: "Channel 1",
                address: "109.234.74.70",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            },
            {
                icon: "Luna.png",
                name: "Channel 2",
                address: "109.234.74.71",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 3",
                address: "109.234.74.72",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 4",
                address: "109.234.74.73",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 5",
                address: "109.234.74.73",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 6",
                address: "109.234.74.73",
                port: "8587",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 7",
                address: "109.234.74.74",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 8",
                address: "109.234.74.74",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 9",
                address: "109.234.74.74",
                port: "8587",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 10",
                address: "109.234.74.75",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 11",
                address: "109.234.74.75",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 12",
                address: "109.234.74.75",
                port: "8587",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 13",
                address: "109.234.74.76",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 14",
                address: "109.234.74.76",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 15",
                address: "109.234.74.76",
                port: "8587",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 16",
                address: "109.234.74.77",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 17",
                address: "109.234.74.77",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 18",
                address: "109.234.74.77",
                port: "8587",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 19",
                address: "109.234.74.78",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 20",
                address: "109.234.74.78",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }
        ],
        Reboot: [{
                icon: "Reboot.png",
                name: "Channel 1",
                address: "8.31.99.161",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 2",
                address: "8.31.99.135",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 3",
                address: "8.31.99.237",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 4",
                address: "8.31.99.136",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 5",
                address: "8.31.99.162",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 6",
                address: "8.31.99.137",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 7",
                address: "8.31.99.195",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 8",
                address: "8.31.99.138",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 9",
                address: "8.31.99.163",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 10",
                address: "8.31.99.144",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 11",
                address: "8.31.99.196",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 12",
                address: "8.31.99.145",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 13",
                address: "8.31.99.157",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 14",
                address: "8.31.99.146",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 15",
                address: "8.31.99.197",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 16",
                address: "8.31.99.158",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 17",
                address: "8.31.99.147",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 18",
                address: "8.31.99.148",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 19",
                address: "8.31.99.150",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 20",
                address: "8.31.99.149",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Cash Shop",
                address: "8.31.99.192",
                port: "8786",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            }
        ],
        InternalWebsites: [{
                icon: "Mushroom.png",
                name: "MapleStory",
                sub: "",
                address: "maplestory.nexon.net",
                port: "80",
                rel: "nexon.net"
            },
            {
                icon: "Nexon.png",
                name: "Forum",
                sub: "",
                address: "forum2.nexon.net",
                port: "80",
                rel: "nexon.net"
            },
            {
                icon: "Nexon.png",
                name: "Support",
                sub: "",
                address: "support.maplestory.nexon.net",
                port: "80",
                rel: "nexon.net"
            },
            {
                icon: "Nexon.png",
                name: "Download",
                sub: "",
                address: "download2.nexon.net",
                port: "80",
                rel: "nexon.net"
            },
            {
                icon: "Nexon.png",
                name: "Press",
                sub: "",
                address: "press.nexon.net",
                port: "80",
                rel: "nexon.net"
            },
            {
                icon: "fa-globe",
                name: "Avatars",
                sub: "NXA",
                address: "msavatar1.nexon.net",
                port: "80",
                rel: "nexon.net"
            },
            {
                icon: "fa-globe",
                name: "Images",
                sub: "NXA",
                address: "nxcache.nexon.net",
                port: "80",
                rel: "nexon.net"
            },
            {
                icon: "fa-globe",
                name: "API",
                sub: "NXA",
                address: "api.nexon.net",
                port: "80",
                rel: "nexon.net"
            },
            {
                icon: "fa-globe",
                name: "Guard",
                sub: "NXA",
                address: "guard.nexon.net",
                port: "80",
                rel: "nexon.net"
            }
        ],
        ExternalWebsites: [{
                icon: "fa-external-link",
                name: "Google",
                sub: "",
                address: "google.com",
                port: "80",
                interval: 60000,
                rel: "google.com"
            }
        ]
    },
    GMS: {
        Login: [{
                icon: "Mushroom.png",
                name: "Login 1",
                address: "34.215.62.60", // Verified as of 
                port: "8484",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Login"
            },
            {
                icon: "Mushroom.png",
                name: "Login 2",
                address: "35.167.153.201", // Verified as of 
                port: "8484",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Login"
            },
            {
                icon: "Mushroom.png",
                name: "Login 3",
                address: "52.37.193.138", // Verified as of 2020-06-10
                port: "8484",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Login"
            }
        ],
        CrossWorld: [{
            icon: "Generic.png",
            name: "Cross World",
            address: "54.149.241.32",
            port: "8586",
            interval: 5000,
            values: [],
            isMapleStoryGameServer: true,
            rel: "Login"
        }],
        Scania: [{
                icon: "Scania.png",
                name: "Channel 1",
                address: "35.163.4.248", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 2",
                address: "54.69.121.239", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 3",
                address: "52.27.135.94", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 4",
                address: "34.218.55.122", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 5",
                address: "54.213.105.170", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 6",
                address: "52.37.131.173", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 7",
                address: "52.38.110.221", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 8",
                address: "50.112.158.189", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 9",
                address: "34.215.85.101", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 10",
                address: "54.191.76.216", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 11",
                address: "54.191.254.95", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 12",
                address: "50.112.211.236", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 13",
                address: "35.165.21.160", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 14",
                address: "34.211.249.74", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 15",
                address: "52.43.74.100", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 16",
                address: "34.209.206.177", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 17",
                address: "34.214.52.19", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 18",
                address: "54.189.248.141", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 19",
                address: "34.208.240.38", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 20",
                address: "54.245.14.209", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Cash Shop",
                address: "52.32.42.163", // Verified as of 
                port: "8785",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Monster Life",
                address: "34.217.198.173", // verified as of
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Auction House",
                address: "34.209.161.140", // Verified as of 
                port: "8785",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            }
        ],
        Bera: [{
                icon: "Bera.png",
                name: "Channel 1",
                address: "54.186.151.49", // Verified as of 2020-06-10
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 2",
                address: "54.214.207.253", // Verified as of 2020-06-10
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 3",
                address: "34.214.214.251", // Verified as of 2020-06-10
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 4",
                address: "35.165.105.161", // Verified as of 2020-06-10
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 5",
                address: "35.167.16.143", // Verified as of 2020-06-10
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 6",
                address: "52.40.39.138", // Verified as of 2020-06-10
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 7",
                address: "54.68.47.217", // Verified as of 2020-06-10
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 8",
                address: "52.35.241.179", // Verified as of 2020-06-10
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 9",
                address: "34.218.68.31", // Verified as of 2020-06-10
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 10",
                address: "52.43.9.29", // Verified as of 2020-06-10
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 11",
                address: "54.213.64.154", // Verified as of 2020-06-10
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 12",
                address: "52.25.121.0", // Verified as of 2020-06-10
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 13",
                address: "54.148.5.57", // Verified as of 2020-06-10
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 14",
                address: "35.161.154.148", // Verified as of 2020-06-10
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 15",
                address: "54.203.140.45", // Verified as of 2020-06-10
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 16",
                address: "35.163.184.1", // Verified as of 2020-06-10
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 17",
                address: "34.218.100.191", // Verified as of 2020-06-10
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 18",
                address: "52.38.89.169", // Verified as of 2020-06-10
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 19",
                address: "52.88.17.178", // Verified as of 2020-06-10
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 20", // Verified as of 2020-06-10
                address: "52.27.189.124",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 21", // Verified as of 2020-06-10
                address: "54.185.114.1",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 22", // Verified as of 2020-06-10
                address: "52.35.244.164",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 23", // Verified as of 2020-06-10
                address: "54.188.77.194",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 24", // Verified as of 2020-06-10
                address: "54.188.54.110",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 25", // Verified as of 2020-06-10
                address: "54.69.112.20",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 26", // Verified as of 2020-06-10
                address: "54.185.17.226",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 27", // Verified as of 2020-06-10
                address: "54.188.58.179",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 28", // Verified as of 2020-06-10
                address: "44.229.126.218",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 29", // Verified as of 2020-06-10
                address: "52.39.65.13",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 30", // Verified as of 2020-06-10
                address: "54.190.177.113",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
			{
                icon: "Bera.png",
                name: "CPQ/DIPQ/EvoLab 1", // Verified as of 2020-06-10
                address: "54.70.148.148",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
			{
                icon: "Bera.png",
                name: "CPQ/DIPQ/EvoLab 2",
                address: "54.70.148.148", // 50.112.51.145 previously, verified as of 2020-06-10
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
			{
                icon: "Bera.png",
                name: "CPQ/DIPQ/EvoLab 3",
                address: "54.70.148.148", // 35.164.186.245 previously, verified as of 2020-06-10
                port: "8587",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Cash Shop",
                address: "54.203.24.179", // Verified as of 2020-06-10
                port: "8786",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Monster Life", // Verified as of 2020-06-10
                address: "34.217.198.173",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Auction House", // Verified as of 2020-06-10
                address: "34.209.161.140",
                port: "8786",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            }
        ],
        Elysium: [{
                icon: "Elysium.png",
                name: "Channel 1",
                address: "54.214.132.190", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Elysium"
            },
            {
                icon: "Elysium.png",
                name: "Channel 2",
                address: "54.245.208.58", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Elysium"
            },
            {
                icon: "Elysium.png",
                name: "Channel 3",
                address: "35.165.10.219", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Elysium"
            },
            {
                icon: "Elysium.png",
                name: "Channel 4",
                address: "54.214.75.83", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Elysium"
            },
            {
                icon: "Elysium.png",
                name: "Channel 5",
                address: "35.163.91.77", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Elysium"
            },
            {
                icon: "Elysium.png",
                name: "Channel 6",
                address: "35.166.234.61", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Elysium"
            },
            {
                icon: "Elysium.png",
                name: "Channel 7",
                address: "52.43.231.158", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Elysium"
            },
            {
                icon: "Elysium.png",
                name: "Channel 8",
                address: "52.35.100.28", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Elysium"
            },
            {
                icon: "Elysium.png",
                name: "Channel 9",
                address: "54.70.100.207", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Elysium"
            },
            {
                icon: "Elysium.png",
                name: "Channel 10",
                address: "35.163.79.48", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Elysium"
            },
            {
                icon: "Elysium.png",
                name: "Channel 11",
                address: "52.32.142.22", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Elysium"
            },
            {
                icon: "Elysium.png",
                name: "Channel 12",
                address: "54.186.3.5", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Elysium"
            },
            {
                icon: "Elysium.png",
                name: "Channel 13",
                address: "34.211.210.222", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Elysium"
            },
            {
                icon: "Elysium.png",
                name: "Channel 14",
                address: "35.166.32.116", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Elysium"
            },
            {
                icon: "Elysium.png",
                name: "Channel 15",
                address: "54.186.75.108", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Elysium"
            },
            {
                icon: "Elysium.png",
                name: "Channel 16",
                address: "52.37.9.209", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Elysium"
            },
            {
                icon: "Elysium.png",
                name: "Channel 17",
                address: "52.37.174.51", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Elysium"
            },
            {
                icon: "Elysium.png",
                name: "Channel 18",
                address: "52.32.10.100", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Elysium"
            },
            {
                icon: "Elysium.png",
                name: "Channel 19",
                address: "54.203.45.149", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Elysium"
            },
            {
                icon: "Elysium.png",
                name: "Channel 20",
                address: "52.41.244.230", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Elysium"
            },
            {
                icon: "Elysium.png",
                name: "Cash Shop",
                address: "52.10.224.51", // Verified as of 
                port: "8787",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Elysium"
            },
            {
                icon: "Elysium.png",
                name: "Monster Life",
                address: "52.42.29.253", // Verified as of
                port: "8587",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Elysium"
            },
            {
                icon: "Elysium.png",
                name: "Auction House",
                address: "34.209.161.140",
                port: "8790",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Elysium"
            }
        ],
		Aurora: [{
                icon: "Aurora.png",
                name: "Channel 1",
                address: "52.26.44.15", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aurora"
            },
            {
                icon: "Aurora.png",
                name: "Channel 2",
                address: "52.88.199.249", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aurora"
            },
            {
                icon: "Aurora.png",
                name: "Channel 3",
                address: "54.71.159.23", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aurora"
            },
            {
                icon: "Aurora.png",
                name: "Channel 4",
                address: "54.200.197.85", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aurora"
            },
            {
                icon: "Aurora.png",
                name: "Channel 5",
                address: "52.24.108.169", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aurora"
            },
            {
                icon: "Aurora.png",
                name: "Channel 6",
                address: "52.32.48.160", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aurora"
            },
            {
                icon: "Aurora.png",
                name: "Channel 7",
                address: "52.27.243.250", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aurora"
            },
            {
                icon: "Aurora.png",
                name: "Channel 8",
                address: "54.203.90.46", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aurora"
            },
            {
                icon: "Aurora.png",
                name: "Channel 9",
                address: "54.148.240.123", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aurora"
            },
            {
                icon: "Aurora.png",
                name: "Channel 10",
                address: "35.164.217.126", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aurora"
            },
            {
                icon: "Aurora.png",
                name: "Channel 11",
                address: "52.36.214.18", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aurora"
            },
            {
                icon: "Aurora.png",
                name: "Channel 12",
                address: "35.162.50.9", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aurora"
            },
            {
                icon: "Aurora.png",
                name: "Channel 13",
                address: "52.40.100.64", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aurora"
            },
            {
                icon: "Aurora.png",
                name: "Channel 14",
                address: "52.39.159.3", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aurora"
            },
            {
                icon: "Aurora.png",
                name: "Channel 15",
                address: "34.216.36.199", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aurora"
            },
            {
                icon: "Aurora.png",
                name: "Channel 16",
                address: "34.213.140.179", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aurora"
            },
            {
                icon: "Aurora.png",
                name: "Channel 17",
                address: "54.203.178.92", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aurora"
            },
            {
                icon: "Aurora.png",
                name: "Channel 18",
                address: "54.214.75.143", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aurora"
            },
            {
                icon: "Aurora.png",
                name: "Channel 19",
                address: "52.24.61.30", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aurora"
            },
            {
                icon: "Aurora.png",
                name: "Channel 20",
                address: "34.208.168.106", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aurora"
            },
            {
                icon: "Aurora.png",
                name: "Cash Shop",
                address: "52.10.224.51", // Verified as of 
                port: "8786",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aurora"
            },
            {
                icon: "Aurora.png",
                name: "Monster Life",
                address: "52.42.29.253", // Verified as of
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aurora"
            },
            {
                icon: "Aurora.png",
                name: "Auction House",
                address: "34.209.161.140",
                port: "8789",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aurora"
            }
        ],
        Reboot: [{
				icon: "Reboot.png",
				name: "Channel 1",
				address: "35.155.204.207",
				port: 8585,
				interval: 5000,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 2",
				address: "52.26.82.74",
				port: 8585,
				interval: 5000,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 3",
				address: "34.217.205.66",
				port: 8585,
				interval: 5000,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 4",
				address: "54.148.188.235",
				port: 8585,
				interval: 5000,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 5",
				address: "54.218.157.183",
				port: 8585,
				interval: 5000,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 6",
				address: "54.68.160.34",
				port: 8585,
				interval: 5000,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 7",
				address: "52.25.78.39",
				port: 8585,
				interval: 5000,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 8",
				address: "52.33.249.126",
				port: 8585,
				interval: 5000,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 9",
				address: "34.218.141.142",
				port: 8585,
				interval: 5000,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 10",
				address: "54.148.170.23",
				port: 8585,
				interval: 5000,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 11",
				address: "54.191.142.56",
				port: 8585,
				interval: 5000,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 12",
				address: "54.201.184.26",
				port: 8585,
				interval: 5000,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 13",
				address: "52.13.185.207",
				port: 8585,
				interval: 5000,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 14",
				address: "34.215.228.37",
				port: 8585,
				interval: 5000,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 15",
				address: "54.187.177.143",
				port: 8585,
				interval: 5000,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 16",
				address: "54.203.83.148",
				port: 8585,
				interval: 5000,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 17",
				address: "35.161.183.101",
				port: 8585,
				interval: 5000,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 18",
				address: "52.43.83.76",
				port: 8585,
				interval: 5000,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 19",
				address: "54.69.114.137",
				port: 8585,
				interval: 5000,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 20",
				address: "54.148.137.49",
				port: 8585,
				interval: 5000,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
            {
                icon: "Reboot.png",
                name: "Channel 21", // Verified as of 
                address: "54.212.109.33",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 22", // Verified as of 
                address: "44.230.255.51",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 23", // Verified as of 
                address: "100.20.116.83",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 24", // Verified as of 
                address: "54.188.84.22",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 25", // Verified as of 
                address: "34.215.170.50",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 26", // Verified as of 
                address: "54.184.162.28",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 27", // Verified as of 
                address: "54.185.209.29",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 28", // Verified as of 
                address: "52.12.53.225",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 29", // Verified as of 
                address: "54.189.33.238",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 30", // Verified as of 
                address: "54.188.84.238",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
	        {
		        icon: "Reboot.png",
		        name: "CPQ/DIPQ/EvoLab 1",
				address: "52.10.175.83",
		        port: "8585",
		        interval: 5000,
		        values: [],
			    isMapleStoryGameServer: true,
			    rel: "Reboot"
			},
	        {
		        icon: "Reboot.png",
		        name: "CPQ/DIPQ/EvoLab 2",
				address: "52.10.175.83",
		        port: "8586",
		        interval: 5000,
		        values: [],
			    isMapleStoryGameServer: true,
			    rel: "Reboot"
			},
	        {
		        icon: "Reboot.png",
		        name: "CPQ/DIPQ/EvoLab 3",
				address: "52.10.175.83",
		        port: "8587",
		        interval: 5000,
		        values: [],
			    isMapleStoryGameServer: true,
			    rel: "Reboot"
			},
            {
                icon: "Reboot.png",
                name: "Cash Shop",
                address: "52.32.42.163",
                port: "8788",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            }
        ],
		Burning: [{
                icon: "Burning.png",
                name: "Channel 1",
                address: "52.26.44.15", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Burning"
            },
            {
                icon: "Burning.png",
                name: "Channel 2",
                address: "52.88.199.249", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Burning"
            },
            {
                icon: "Burning.png",
                name: "Channel 3",
                address: "54.71.159.23", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Burning"
            },
            {
                icon: "Burning.png",
                name: "Channel 4",
                address: "54.200.197.85", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Burning"
            },
            {
                icon: "Burning.png",
                name: "Channel 5",
                address: "52.24.108.169", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Burning"
            },
            {
                icon: "Burning.png",
                name: "Channel 6",
                address: "52.32.48.160", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Burning"
            },
            {
                icon: "Burning.png",
                name: "Channel 7",
                address: "52.27.243.250", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Burning"
            },
            {
                icon: "Burning.png",
                name: "Channel 8",
                address: "54.203.90.46", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Burning"
            },
            {
                icon: "Burning.png",
                name: "Channel 9",
                address: "54.148.240.123", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Burning"
            },
            {
                icon: "Burning.png",
                name: "Channel 10",
                address: "35.164.217.126", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Burning"
            },
            {
                icon: "Burning.png",
                name: "Channel 11",
                address: "52.36.214.18", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Burning"
            },
            {
                icon: "Burning.png",
                name: "Channel 12",
                address: "35.162.50.9", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Burning"
            },
            {
                icon: "Burning.png",
                name: "Channel 13",
                address: "52.40.100.64", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Burning"
            },
            {
                icon: "Burning.png",
                name: "Channel 14",
                address: "52.39.159.3", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Burning"
            },
            {
                icon: "Burning.png",
                name: "Channel 15",
                address: "34.216.36.199", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Burning"
            },
            {
                icon: "Burning.png",
                name: "Channel 16",
                address: "34.213.140.179", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Burning"
            },
            {
                icon: "Burning.png",
                name: "Channel 17",
                address: "54.203.178.92", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Burning"
            },
            {
                icon: "Burning.png",
                name: "Channel 18",
                address: "54.214.75.143", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Burning"
            },
            {
                icon: "Burning.png",
                name: "Channel 19",
                address: "52.24.61.30", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Burning"
            },
            {
                icon: "Burning.png",
                name: "Channel 20",
                address: "34.208.168.106", // Verified as of 
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Burning"
            },
            {
                icon: "Burning.png",
                name: "Cash Shop",
                address: "52.10.224.51", // Verified as of 
                port: "8786",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Burning"
            },
            {
                icon: "Burning.png",
                name: "Monster Life",
                address: "52.42.29.253", // Verified as of
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Burning"
            },
            {
                icon: "Burning.png",
                name: "Auction House",
                address: "34.209.161.140",
                port: "8789",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Burning"
            }
        ],
        Websites: [{
                icon: "Mushroom.png",
                name: "MapleStory",
                sub: "",
                address: "maplestory.nexon.net",
                port: "80",
                rel: "nexon.net"
            },
            {
                icon: "Nexon.png",
                name: "Forum",
                sub: "",
                address: "forums.maplestory.nexon.net",
                port: "80",
                rel: "nexon.net"
            },
            {
                icon: "Nexon.png",
                name: "Support",
                sub: "",
                address: "support-maplestory.nexon.net",
                port: "80",
                rel: "nexon.net"
            },
            {
                icon: "Nexon.png",
                name: "Download",
                sub: "",
                address: "download2.nexon.net",
                port: "80",
                rel: "nexon.net"
            },
            {
                icon: "fa-globe",
                name: "Avatars",
                sub: "NXA",
                address: "msavatar1.nexon.net",
                port: "80",
                rel: "nexon.net"
            },
            {
                icon: "fa-globe",
                name: "Images",
                sub: "NXA",
                address: "nxcache.nexon.net",
                port: "80",
                rel: "nexon.net"
            },
            {
                icon: "fa-globe",
                name: "Guard",
                sub: "NXA",
                address: "guard.nexon.net",
                port: "80",
                rel: "nexon.net"
            }
        ]
    },
    KMS: {
        Login: [{
            icon: "Mushroom.png",
            name: "Login",
            address: "175.207.0.34",
            port: "8484",
            interval: 5000,
            values: [],
            isMapleStoryGameServer: true,
            rel: "Login"
        }],
        '스카니아': [{
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 1",
                address: "175.207.0.65",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Ch. 20세이상",
                address: "175.207.0.65",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 2",
                address: "175.207.0.240",
                port: "8587",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 3",
                address: "175.207.0.240",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 4",
                address: "175.207.0.241",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 5",
                address: "175.207.0.66",
                port: "8587",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 6",
                address: "175.207.0.66",
                port: "8588",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 7",
                address: "175.207.0.243",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 8",
                address: "175.207.0.67",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 9",
                address: "175.207.0.67",
                port: "8587",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 10",
                address: "175.207.0.67",
                port: "8588",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 11",
                address: "175.207.0.68",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 12",
                address: "175.207.0.68",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 13",
                address: "175.207.0.68",
                port: "8587",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 14",
                address: "175.207.0.243",
                port: "8588",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 15",
                address: "175.207.0.241",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 16",
                address: "175.207.0.250",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 17",
                address: "175.207.0.242",
                port: "8587",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 18",
                address: "175.207.0.242",
                port: "8588",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 19",
                address: "175.207.0.69",
                port: "8589",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Cash Shop",
                address: "175.207.0.10",
                port: "8780",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            }
        ],
        // IE fails here, that's why the Korean text is wrapped in quotes.
        '베라': [{
                icon: "Bera.png",
                english: "Bera",
                name: "Channel 1",
                address: "175.207.0.70",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "베라"
            },
            {
                icon: "Bera.png",
                english: "Bera",
                name: "Ch. 20세이상",
                address: "175.207.0.70",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "베라"
            }
        ],
        '루나': [{
                icon: "Luna.png",
                english: "Luna",
                name: "Channel 1",
                address: "175.207.0.80",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "루나"
            },
            {
                icon: "Luna.png",
                english: "Luna",
                name: "Ch. 20세이상",
                address: "175.207.0.80",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "루나"
            }
        ],
        '제니스': [{
                icon: "Zenith.png",
                english: "Zenith",
                name: "Channel 1",
                address: "175.207.0.85",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "제니스"
            },
            {
                icon: "Zenith.png",
                english: "Zenith",
                name: "Ch. 20세이상",
                address: "175.207.0.85",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "제니스"
            }
        ],
        '크로아': [{
                icon: "Croa.png",
                english: "Croa",
                name: "Channel 1",
                address: "175.207.0.90",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "크로아"
            },
            {
                icon: "Croa.png",
                english: "Croa",
                name: "Ch. 20세이상",
                address: "175.207.0.90",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "크로아"
            }
        ],
        '유니온': [{
                icon: "Union.png",
                english: "Union",
                name: "Channel 1",
                address: "175.207.0.246",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "유니온"
            },
            {
                icon: "Union.png",
                english: "Union",
                name: "Ch. 20세이상",
                address: "175.207.0.115",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "유니온"
            }
        ],
        '엘리시움': [{
                icon: "Elysium.png",
                english: "Elysium",
                name: "Channel 1",
                address: "175.207.0.140",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "엘리시움"
            },
            {
                icon: "Elysium.png",
                english: "Elysium",
                name: "Ch. 20세이상",
                address: "175.207.0.140",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "엘리시움"
            }
        ],
        '이노시스': [{
                icon: "Enosis.png",
                english: "Enosis",
                name: "Channel 1",
                address: "175.207.0.165",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "이노시스"
            },
            {
                icon: "Enosis.png",
                english: "Enosis",
                name: "Ch. 20세이상",
                address: "175.207.0.165",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "이노시스"
            }
        ],
        '레드': [{
                icon: "Red.png",
                english: "Red",
                name: "Channel 1",
                address: "175.207.0.235",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "레드"
            },
            {
                icon: "Red.png",
                english: "Red",
                name: "Ch. 20세이상",
                address: "175.207.0.235",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "레드"
            }
        ],
        '오로라': [{
                icon: "Aurora.png",
                english: "Aurora",
                name: "Channel 1",
                address: "175.207.0.230",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "오로라"
            },
            {
                icon: "Aurora.png",
                english: "Aurora",
                name: "Ch. 20세이상",
                address: "175.207.0.230",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "오로라"
            }
        ]
    },
    MSEA: {
        Login: [{
                icon: "Mushroom.png",
                name: "Login 1",
                address: "121.52.202.7",
                port: "8484",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Login"
            },
            {
                icon: "Mushroom.png",
                name: "Login 2",
                address: "121.52.202.9",
                port: "8484",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Login"
            },
            {
                icon: "Generic.png",
                name: "Merge World",
                address: "121.52.202.81",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Login"
            }
        ],
        Aquila: [{
                icon: "Aquila.png",
                name: "Channel 1",
                address: "121.52.202.15",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 2",
                address: "121.52.202.16",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 3",
                address: "121.52.202.17",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 4",
                address: "121.52.202.18",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 5",
                address: "121.52.202.19",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 6",
                address: "121.52.202.20",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 7",
                address: "121.52.202.21",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 8",
                address: "121.52.202.22",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 9",
                address: "121.52.202.23",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 10",
                address: "121.52.202.24",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 11",
                address: "121.52.202.25",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 12",
                address: "121.52.202.26",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 13",
                address: "121.52.202.27",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 14",
                address: "121.52.202.28",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 15",
                address: "121.52.202.29",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 16",
                address: "121.52.202.30",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 17",
                address: "121.52.202.31",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 18",
                address: "121.52.202.32",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 19",
                address: "121.52.202.33",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 20",
                address: "121.52.202.34",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Cash Shop",
                address: "121.52.202.12",
                port: "8787",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
			{
                icon: "Aquila.png",
                name: "Auction",
                address: "121.52.202.85",
                port: "9000",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            }
        ],
        Bootes: [{
                icon: "Bootes.png",
                name: "Channel 1",
                address: "121.52.202.35",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 2",
                address: "121.52.202.36",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 3",
                address: "121.52.202.37",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 4",
                address: "121.52.202.38",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 5",
                address: "121.52.202.39",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 6",
                address: "121.52.202.40",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 7",
                address: "121.52.202.41",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 8",
                address: "121.52.202.42",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 9",
                address: "121.52.202.43",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 10",
                address: "121.52.202.44",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 11",
                address: "121.52.202.35",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 12",
                address: "121.52.202.36",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 13",
                address: "121.52.202.37",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 14",
                address: "121.52.202.38",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 15",
                address: "121.52.202.39",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 16",
                address: "121.52.202.40",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 17",
                address: "121.52.202.41",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 18",
                address: "121.52.202.42",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 19",
                address: "121.52.202.43",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 20",
                address: "121.52.202.44",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Cash Shop",
                address: "121.52.202.12",
                port: "8788",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
			{
                icon: "Bootes.png",
                name: "Auction",
                address: "121.52.202.86",
                port: "9000",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            }
        ],
        Cassiopeia: [{
                icon: "Cassiopeia.png",
                name: "Channel 1",
                address: "121.52.202.51",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 2",
                address: "121.52.202.52",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 3",
                address: "121.52.202.53",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 4",
                address: "121.52.202.54",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 5",
                address: "121.52.202.55",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 6",
                address: "121.52.202.56",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 7",
                address: "121.52.202.57",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 8",
                address: "121.52.202.58",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 9",
                address: "121.52.202.59",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 10",
                address: "121.52.202.60",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 11",
                address: "121.52.202.51",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 12",
                address: "121.52.202.52",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 13",
                address: "121.52.202.53",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 14",
                address: "121.52.202.54",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 15",
                address: "121.52.202.55",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 16",
                address: "121.52.202.56",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 17",
                address: "121.52.202.57",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 18",
                address: "121.52.202.58",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 19",
                address: "121.52.202.59",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 20",
                address: "121.52.202.60",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Cash Shop",
                address: "121.52.202.12",
                port: "8789",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
			{
                icon: "Cassiopeia.png",
                name: "Auction",
                address: "121.52.202.87",
                port: "9000",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            }
        ],
        D2J: [{
                icon: "D2J.png",
                name: "Channel 1",
                address: "121.52.202.61",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "D2J"
            },
            {
                icon: "D2J.png",
                name: "Channel 2",
                address: "121.52.202.62",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "D2J"
            },
            {
                icon: "D2J.png",
                name: "Channel 3",
                address: "121.52.202.63",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "D2J"
            },
            {
                icon: "D2J.png",
                name: "Channel 4",
                address: "121.52.202.64",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "D2J"
            },
            {
                icon: "D2J.png",
                name: "Channel 5",
                address: "121.52.202.65",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "D2J"
            },
            {
                icon: "D2J.png",
                name: "Channel 6",
                address: "121.52.202.66",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "D2J"
            },
            {
                icon: "D2J.png",
                name: "Channel 7",
                address: "121.52.202.67",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "D2J"
            },
            {
                icon: "D2J.png",
                name: "Channel 8",
                address: "121.52.202.68",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "D2J"
            },
            {
                icon: "D2J.png",
                name: "Channel 9",
                address: "121.52.202.69",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "D2J"
            },
            {
                icon: "D2J.png",
                name: "Channel 10",
                address: "121.52.202.70",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "D2J"
            },
            {
                icon: "D2J.png",
                name: "Channel 11",
                address: "121.52.202.61",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "D2J"
            },
            {
                icon: "D2J.png",
                name: "Channel 12",
                address: "121.52.202.62",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "D2J"
            },
            {
                icon: "D2J.png",
                name: "Channel 13",
                address: "121.52.202.63",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "D2J"
            },
            {
                icon: "D2J.png",
                name: "Channel 14",
                address: "121.52.202.64",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "D2J"
            },
            {
                icon: "D2J.png",
                name: "Channel 15",
                address: "121.52.202.65",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "D2J"
            },
			{
                icon: "D2J.png",
                name: "Channel 16",
                address: "121.52.202.66",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "D2J"
            },
			{
                icon: "D2J.png",
                name: "Channel 17",
                address: "121.52.202.67",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "D2J"
            },
			{
                icon: "D2J.png",
                name: "Channel 18",
                address: "121.52.202.68",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "D2J"
            },
			{
                icon: "D2J.png",
                name: "Channel 19",
                address: "121.52.202.69",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "D2J"
            },
			{
                icon: "D2J.png",
                name: "Channel 20",
                address: "121.52.202.70",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "D2J"
            },
            {
                icon: "D2J.png",
                name: "Cash Shop",
                address: "121.52.202.12",
                port: "8790",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "D2J"
            },
			{
                icon: "D2J.png",
                name: "Auction",
                address: "121.52.202.88",
                port: "9000",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "D2J"
            },
        ]
    },
	THMS: {
        Login: [{
            icon: "Mushroom.png",
            name: "Login",
            address: "175.207.0.34",
            port: "8484",
            interval: 5000,
            values: [],
            isMapleStoryGameServer: true,
            rel: "Login"
        }],
        'สคาเนีย': [{
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 1",
                address: "13.228.80.96",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "สคาเนีย"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 2",
                address: "13.228.80.96",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "สคาเนีย"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 3",
                address: "13.228.76.20",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "สคาเนีย"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 4",
                address: "13.228.76.20",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "สคาเนีย"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 5",
                address: "13.228.42.166",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "สคาเนีย"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 6",
                address: "13.228.42.166",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "สคาเนีย"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 7",
                address: "13.228.52.228",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "สคาเนีย"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 8",
                address: "13.228.52.228",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "สคาเนีย"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 9",
                address: "13.228.80.94",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "สคาเนีย"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 10",
                address: "13.228.80.94",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "สคาเนีย"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 11",
                address: "13.228.80.27",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "สคาเนีย"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 12",
                address: "13.228.80.27",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "สคาเนีย"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 13",
                address: "13.228.45.25",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "สคาเนีย"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 14",
                address: "13.228.45.25",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "สคาเนีย"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 15",
                address: "13.228.80.54",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "สคาเนีย"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 16",
                address: "13.228.80.54",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "สคาเนีย"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 17",
                address: "13.228.45.138",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "สคาเนีย"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 18",
                address: "13.228.45.138",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "สคาเนีย"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 19",
                address: "13.228.58.55",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "สคาเนีย"
            },
			{
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 20",
                address: "13.228.58.55",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "สคาเนีย"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Cash Shop - ปิดใช้งาน",
                address: "ahri.in.th",
                port: "8780",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "สคาเนีย"
            },
        ],
        // IE fails here, that's why the Korean text is wrapped in quotes.
        'เบร่า': [{
                icon: "Bera.png",
                english: "Bera",
                name: "Channel 1",
                address: "175.207.0.70",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "เบร่า"
            },
            {
                icon: "Bera.png",
                english: "Bera",
                name: "Ch. 20세이상",
                address: "175.207.0.70",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "เบร่า"
            }
        ],
        'ลูน่า': [{
                icon: "Luna.png",
                english: "Luna",
                name: "Channel 1",
                address: "175.207.0.80",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "ลูน่า"
            },
            {
                icon: "Luna.png",
                english: "Luna",
                name: "Ch. 20세이상",
                address: "175.207.0.80",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "ลูน่า"
            }
        ],
        'เซนิท': [{
                icon: "Zenith.png",
                english: "Zenith",
                name: "Channel 1",
                address: "175.207.0.85",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "เซนิท"
            },
            {
                icon: "Zenith.png",
                english: "Zenith",
                name: "Ch. 20세이상",
                address: "175.207.0.85",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "เซนิท"
            }
        ],
        'โครอา': [{
                icon: "Croa.png",
                english: "Croa",
                name: "Channel 1",
                address: "175.207.0.90",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "โครอา"
            },
            {
                icon: "Croa.png",
                english: "Croa",
                name: "Ch. 20세이상",
                address: "175.207.0.90",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "โครอา"
            }
        ],
        'อิลิเซียม': [{
                icon: "Elysium.png",
                english: "Elysium",
                name: "Channel 1",
                address: "175.207.0.140",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "อิลิเซียม"
            },
            {
                icon: "Elysium.png",
                english: "Elysium",
                name: "Ch. 20세이상",
                address: "175.207.0.140",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "อิลิเซียม"
            }
        ],
        'อิโนซิส': [{
                icon: "Enosis.png",
                english: "Enosis",
                name: "Channel 1",
                address: "175.207.0.165",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "อิโนซิส"
            },
            {
                icon: "Enosis.png",
                english: "Enosis",
                name: "Ch. 20세이상",
                address: "175.207.0.165",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "อิโนซิส"
            }
        ],
        'เรด': [{
                icon: "Red.png",
                english: "Red",
                name: "Channel 1",
                address: "175.207.0.235",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "เรด"
            },
            {
                icon: "Red.png",
                english: "Red",
                name: "Ch. 20세이상",
                address: "175.207.0.235",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "เรด"
            }
        ],
        'ออโรรา': [{
                icon: "Aurora.png",
                english: "Aurora",
                name: "Channel 1",
                address: "175.207.0.230",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "ออโรรา"
            },
            {
                icon: "Aurora.png",
                english: "Aurora",
                name: "Ch. 20세이상",
                address: "175.207.0.230",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "ออโรรา"
            }
        ]
    },
}

var checker = {
    isMainPage: ko.observable(selected == "Main"),
    selected: ko.observable(selected),
    subSelection: ko.observable(subSelection),
    getDefaultSubSelectionForVersion: GetDefaultSubSelectionForVersion,
    modifySettings: ModifySettings,
    defaultSettings: DefaultSettings,
    getServersCountForApplication: GetServersCountForApplication,
    versions: [{
            abbr: "EMS",
            name: "MapleStory Europe",
            available: true,
            complete: true,
            icon: "Luna.png",
            short: "Europe",
            serverCount: [
                3,
                1,
                1
            ],
            applications: [
                GameServer("Europe", 0, [{
                        icon: "Mushroom.png",
                        name: "Login",
                        english: false,
                        sub: ""
                    },
                    {
                        icon: "Luna.png",
                        name: "Luna",
                        english: false,
                        sub: "World"
                    },
                    {
                        icon: "Reboot.png",
                        name: "Reboot",
                        english: false,
                        sub: "World"
                    }
                ], [
                    servers.EMS.Login,
                    servers.EMS.Luna,
                    servers.EMS.Reboot,
                ]),
                {
                    name: "Internal Sites",
                    description: "These are pages which are hosted on Nexon's servers.",
                    icons: [{
                            icon: "Nexon.png",
                            name: "nexon.net",
                            english: false,
                            sub: ""
                        }
                    ],
                    content: function() {
                        return new PingModel([
                            servers.EMS.InternalWebsites
                        ])
                    },
                    selectedServers: ko.observable(loadingArr)
                },
                {
                    name: "External Sites",
                    description: "These are pages which are hosted on external servers.",
                    selectedServers: ko.observable(loadingArr),
                    icons: [],
                    content: function() {
                        return new PingModel([
                            servers.EMS.ExternalWebsites
                        ])
                    }
                }
            ]
        },
        {
            abbr: "GMS",
            name: "MapleStory North America <small>(Global)</small>",
            available: true,
            complete: true,
            icon: "Scania.png",
            short: "North America (Global)",
            serverCount: [
                7,
				1
            ],
            applications: [
                GameServer("Global", 0, [{
                        icon: "Mushroom.png",
                        name: "Login",
                        english: false,
                        sub: ""
                    },
                    {
                        icon: "Scania.png",
                        name: "Scania",
                        english: false,
                        sub: "World"
                    },
                    {
                        icon: "Bera.png",
                        name: "Bera",
                        english: false,
                        sub: "World"
                    },
                    {
                        icon: "Elysium.png",
                        name: "Elysium",
                        english: false,
                        sub: "World"
                    },
                    {
                        icon: "Aurora.png",
                        name: "Aurora",
                        english: false,
                        sub: "World"
                    },
                    {
                        icon: "Reboot.png",
                        name: "Reboot",
                        english: false,
                        sub: "World"
                    },
					{
                        icon: "Burning.png",
                        name: "Burning",
                        english: false,
                        sub: "World"
                    }
                ], [
                    servers.GMS.Login,
                    servers.GMS.CrossWorld,
                    servers.GMS.Scania,
                    servers.GMS.Bera,
                    servers.GMS.Aurora,
                    servers.GMS.Elysium,
                    servers.GMS.Reboot,
					servers.GMS.Burning
                ]),
                {
                    name: "Websites",
                    description: "These are pages related to Nexon America's internal and external servers.",
                    selectedServers: ko.observable(loadingArr),
                    icons: [{
                        icon: "Nexon.png",
                        name: "nexon.net",
                        english: false,
                        sub: "World"
                    }],
                    content: function() {
                        return new PingModel([
                            servers.GMS.Websites
                        ])
                    }
                }
            ]
        },
        {
            abbr: "JMS",
            name: "MapleStory Japan <small>日本</small>",
            available: false,
            complete: false,
            icon: "Galicia.png",
            short: "日本 | Japan",
            timezone: false,
            applications: []
        },
        {
            abbr: "KMS",
            name: "MapleStory Korea <small>(한국)</small>",
            available: true,
            complete: false,
            icon: "Mushroom.png",
            short: "한국 | Korea",
            serverCount: [
                11
            ],
            applications: [
                GameServer("Korea", 9, [{
                        icon: "Mushroom.png",
                        name: "Login",
                        english: false,
                        sub: ""
                    },
                    {
                        icon: "Scania.png",
                        name: "스카니아",
                        english: "Scania",
                        sub: "World"
                    },
                    {
                        icon: "Bera.png",
                        name: "베라",
                        english: "Bera",
                        sub: "World"
                    },
                    {
                        icon: "Luna.png",
                        name: "루나",
                        english: "Luna",
                        sub: "World"
                    },
                    {
                        icon: "Zenith.png",
                        name: "제니스",
                        english: "Zenith",
                        sub: "World"
                    },
                    {
                        icon: "Croa.png",
                        name: "크로아",
                        english: "Croa",
                        sub: "World"
                    },
                    {
                        icon: "Union.png",
                        name: "유니온",
                        english: "Union",
                        sub: "World"
                    },
                    {
                        icon: "Elysium.png",
                        name: "엘리시움",
                        english: "Elysium",
                        sub: "World"
                    },
                    {
                        icon: "Enosis.png",
                        name: "이노시스",
                        english: "Enosis",
                        sub: "World"
                    },
                    {
                        icon: "Red.png",
                        name: "레드",
                        english: "Red",
                        sub: "World"
                    },
                    {
                        icon: "Aurora.png",
                        name: "오로라",
                        english: "Aurora",
                        sub: "World"
                    }
                ], [
                    servers.KMS.Login,
                    // Not using dot notation because IE sucks.
                    servers.KMS['스카니아'],
                    servers.KMS['베라'],
                    servers.KMS['루나'],
                    servers.KMS['제니스'],
                    servers.KMS['크로아'],
                    servers.KMS['유니온'],
                    servers.KMS['엘리시움'],
                    servers.KMS['이노시스'],
                    servers.KMS['레드'],
                    servers.KMS['오로라']
                ])
            ]
        },
        {
            abbr: "MSEA",
            name: "MapleStory SEA <small>(SG / MY)</small>",
            available: true,
            complete: false,
            icon: "Aquila.png",
            short: "Maple SEA SG / MY",
            serverCount: [
                11
            ],
            applications: [
                GameServer("SEA", 8, [{
                        icon: "Mushroom.png",
                        name: "Login",
                        english: false,
                        sub: ""
                    },
                    {
                        icon: "Aquila.png",
                        name: "Aquila",
                        english: false,
                        sub: "World"
                    },
                    {
                        icon: "Bootes.png",
                        name: "Bootes",
                        english: false,
                        sub: "World"
                    },
                    {
                        icon: "Cassiopeia.png",
                        name: "Cassiopeia",
                        english: false,
                        sub: "World"
                    },
                    /*
                    	{
                    		icon: "Delphinus.png",
                    		name: "Delphinus",
                    		english: false,
                    		sub: "World"
                    	},
                    	{
                    		icon: "Eridanus.png",
                    		name: "Eridanus",
                    		english: false,
                    		sub: "World"
                    	},
                    	{
                    		icon: "Izar.png",
                    		name: "Izar",
                    		english: false,
                    		sub: "World"
                    	},*/
                    {
                        icon: "D2J.png",
                        name: "D2J",
                        english: false,
                        sub: "World"
                    }
                    /*,
                    	{
                    		icon: "Fornax.png",
                    		name: "Fornax",
                    		english: false,
                    		sub: "World"
                    	},
                    	{
                    		icon: "Gemini.png",
                    		name: "Gemini",
                    		english: false,
                    		sub: "World"
                    	},
                    	{
                    		icon: "Hercules.png",
                    		name: "Hercules",
                    		english: false,
                    		sub: "World"
                    	}*/
                ], [
                    servers.MSEA.Login,
                    servers.MSEA.Aquila,
                    servers.MSEA.Bootes,
                    servers.MSEA.Cassiopeia,
                    servers.MSEA.D2J
                ])
            ]
        },
        {
            abbr: "THMS",
            name: "MapleStory Thailand",
            available: true,
            complete: false,
            icon: "Mushroom.png",
            short: "ไทย | Thailand",
            serverCount: [
                11
            ],
            applications: [
                GameServer("Thailand", 7, [{
                        icon: "Mushroom.png",
                        name: "Login",
                        english: false,
                        sub: ""
                    },
                    {
                        icon: "Scania.png",
                        name: "สคาเนีย",
                        english: "Scania",
                        sub: "World"
                    },
					/*
                    {
                        icon: "Bera.png",
                        name: "เบร่า",
                        english: "Bera",
                        sub: "World"
                    },
                    {
                        icon: "Luna.png",
                        name: "ลูน่า",
                        english: "Luna",
                        sub: "World"
                    },
                    {
                        icon: "Zenith.png",
                        name: "เซนิท",
                        english: "Zenith",
                        sub: "World"
                    },
                    {
                        icon: "Croa.png",
                        name: "โครอา",
                        english: "Croa",
                        sub: "World"
                    },
                    {
                        icon: "Elysium.png",
                        name: "อิลิเซียม",
                        english: "Elysium",
                        sub: "World"
                    },
                    {
                        icon: "Enosis.png",
                        name: "อิโนซิส",
                        english: "Enosis",
                        sub: "World"
                    },
                    {
                        icon: "Red.png",
                        name: "เรด",
                        english: "Red",
                        sub: "World"
                    },
                    {
                        icon: "Aurora.png",
                        name: "ออโรรา",
                        english: "Aurora",
                        sub: "World"
                    }
					*/
                ], [
                    servers.THMS.Login,
                    // Not using dot notation because IE sucks.
                    servers.THMS['สคาเนีย'],
                    servers.THMS['เบร่า'],
                    servers.THMS['ลูน่า'],
                    servers.THMS['เซนิท'],
                    servers.THMS['โครอา'],
                    servers.THMS['อิลิเซียม'],
                    servers.THMS['อิโนซิส'],
                    servers.THMS['เรด'],
                    servers.THMS['ออโรรา']
                ])
            ]
        }
    ],
    updateSelectedServers: UpdateSelectedServers,
    selectedIcon: ko.observable(GetEnglishIconNameForServer(this.subSelection)),
    settings: {
        pingOffset: ko.observable(0),
        delay: ko.observable(readCookie("Delay") ? readCookie("Delay") : 100),
        clickToRefresh: ko.observable(readCookie("ClickToRefresh") == "false" ? false : false),
        fixPing: ko.observable(readCookie("FixPing") == "false" ? false : true),
        showConnection: ko.observable(readCookie("ShowConnection") == "false" ? false : true),
        showIPPort: ko.observable(readCookie("ShowIPPort") == "false" ? false : true),
        timeout: ko.observable(readCookie("Timeout") ? readCookie("Timeout") : 5000),
        showControls: ko.observable(false)
    },
    currentTime: ko.observable('<span><i class="fa fa-cog fa-spin"></i> Checking server time...</span>')
};

checker.subSelection.subscribe(function(newValue) {
    checker.selectedIcon(GetEnglishIconNameForServer(newValue));
});

if (selected != 'Main') {
    GetPingOffset();
}

ko.applyBindings(checker);

function GetEnglishIconNameForServer(serverName) {
    switch (serverName) {
        case "스카니아":
            return "Scania";
        case "베라":
            return "Bera";
        case "루나":
            return "Luna";
        case "제니스":
            return "Zenith";
        case "크로아":
            return "Croa";
        case "유니온":
            return "Union";
        case "엘리시움":
            return "Elysium";
        case "이노시스":
            return "Enosis";
        case "레드":
            return "Red";
        case "오로라":
            return "Aurora";
        case "Login":
            return "Mushroom";
        case "สคาเนีย":
            return "Scania";
        case "เบร่า":
            return "Bera";
        case "ลูน่า":
            return "Luna";
        case "เซนิท":
            return "Zenith";
        case "โครอา":
            return "Croa";
        case "อิลิเซียม":
            return "Elysium";
        case "อิโนซิส":
            return "Enosis";
        case "เรด":
            return "Red";
        case "ออโรรา":
            return "Aurora";
        default:
            return serverName;
    }
}

function UpdateSelectedServers(parent, index, name) {
    var name = name || checker.subSelection();

    if (loadingTimers.length > index) {
        window.clearInterval(loadingTimers[index]);
    }

    if (parent.name == "Game Servers" && !clockTicking) {
        clockTicking = true;
        setInterval(function() {
            var d = new Date(),
                o = d.getTimezoneOffset() / 60;

            d.setHours(d.getHours() + o + parent.timeOffset);
            checker.currentTime('<span><i class="fa fa-clock-o"></i> Server Time</span> ' + moment(d).format('h:mm:ss') + ' <span>' + moment(d).format('A') + '</span>');
        }, 1000);
    }

    parent.selectedServers(loadingArr);
    window.location.hash = '#' + checker.selected() + '-' + name;
    subSelection = name;
    checker.subSelection(name);

    loadingTimers.push(setTimeout(function() {
        var content = parent.content();
        parent.selectedServers(parent.content().servers());
    }, 300));
}

function GetCheckTimeout() {
    return checker.settings.timeout();
}

function GetPingOffset() {
    return new PingModel([{
        icon: "Mushroom.png",
        name: "Self",
        address: "127.0.0.1",
        port: "80",
        interval: 5000,
        values: [],
        unknown: true,
        rel: "Self"
    }]);
}

function GetDefaultSubSelectionForVersion(version) {
    switch (version) {
        case 'EMS':
            return 'Luna';
        case 'GMS':
            return 'Login';
        case 'KMS':
            return '스카니아';
        case 'MSEA':
            return 'Login';
		case 'THMS':
		    return 'สคาเนีย';
        default:
            return;
    }
}

function SetPingOffset(offset) {
    checker.settings.pingOffset(offset);
}

function ModifySettings() {
    var delay = checker.settings.delay(),
        timeout = checker.settings.timeout();

    createCookie("Delay", delay > 10000 ? 10000 : (delay < 50 ? 50 : delay), 3650);
    createCookie("Timeout", timeout > 60000 ? 60000 : (timeout < 500 ? 500 : timeout), 3650);
    createCookie("ShowIPPort", checker.settings.showIPPort(), 3650);
    createCookie("ShowConnection", checker.settings.showConnection(), 3650);
    createCookie("ClickToRefresh", checker.settings.clickToRefresh(), 3650);
    createCookie("FixPing", checker.settings.fixPing(), 3650);

    window.location.reload();
}

function DefaultSettings() {
    checker.settings.delay(checkDelay);
    checker.settings.timeout(checkTimeout);
    checker.settings.showIPPort(showIPPort);
    checker.settings.showConnection(showConnection);
    checker.settings.clickToRefresh(clickToRefresh);
    checker.settings.fixPing(fixPing);
}

function GetServersCountForApplication(version, name) {
    var v = false;
    for (var i = 0; i < checker.versions.length; i++) {
        if (checker.versions[i].name == version) {
            v = checker.versions[i];
            break;
        }
    }

    if (v == false) {
        return 0;
    }

    for (var j = 0; j < v.applications.length; j++) {
        if (v.applications[j].name == name) {
            return v.serverCount[j];
        }
    }

    return 0;
}

function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    } else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
