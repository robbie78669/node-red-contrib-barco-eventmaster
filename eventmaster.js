/**
 * Copyright 2016 Robbie Bruce
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/



module.exports = function(RED) {

	"use strict";
	var rpc = require('node-json-rpc');

	function eventMasterListPresets( n ) {

		RED.nodes.createNode(this, n);

		var node = this;

  		node.addr = n.addr;
  		node.port = n.port;

		node.screenDest = n.srcdest || -1;
		node.auxDest = n.auxdest || -1;

		console.log(`listPreset (screendest= ${node.screenDest}, ausDest= ${node.auxDest})`);

		if (node.addr== "") {
            node.warn("EventMaster: ip address not set");
        } else if (node.port == 0) {
            node.warn("EventMaster: port not set");
        } else if (isNaN(node.port) || (node.port < 1) || (node.port > 65535)) {
            node.warn("EventMaster: port number not valid");
        } else {
       
			var options = {
					host: '127.0.0.1',
					port: 5858,
					path: '/',
					strict: true
				};
			options.host = node.addr;
			options.port = node.port;

			node.client = new rpc.Client(options);

	        this.status({fill:"green", shape:"dot", text:"connected"});

	        node.on("input", function( msg ) {

	        	var err, res;

	 			node.client.call(
	      			{"jsonrpc": "2.0", "method": "listPresets", "params": [node.screenDest,node.auxDest], "id": 1234},
	      			function (err, res) {
	          			// Did it all work ? 
	          			if (err) { console.log(`listPreset - Error on JSON-RPC call ${err}`); }
	          			else { 
	          				var msg = { 
	          					topic: "",
	          					payload: res,
	          					ip: node.addr,
	          					port: node.port 
	          				}; 
	          				console.log(`listPreset - success!` ); 
	          				node.send( msg);
	          			}
	          		}
	        	);
	     	});
        }

        node.on("close", function () {
			this.status({fill:"red", shape:"ring", text:"diconnected"});
        });
	}
	console.log("regstering listpresets");
	RED.nodes.registerType("listpresets", eventMasterListPresets);
	console.log("regstered listpresets");

	function eventMasterListDestinationsForPreset( n ) {

		RED.nodes.createNode(this, n);

		var node = this;

  		node.addr = n.addr;
		node.port = n.port;
		node.presetid = n.presetid || -1;
		

		console.log(` id= ${node.id}`);

		if (node.addr== "") {
            node.warn("EventMaster: ip address not set");
        } else if (node.port == 0) {
            node.warn("EventMaster: port not set");
        } else if (isNaN(node.port) || (node.port < 1) || (node.port > 65535)) {
            node.warn("EventMaster: port number not valid");
        } else {
       
			var options = {
					host: '127.0.0.1',
					port: 5858,
					path: '/',
					strict: true
				};
			options.host = node.addr;
			options.port = node.port;

			node.client = new rpc.Client(options);

			console.log("listdestinationsforpreset caling status green");
	        this.status({fill:"green", shape:"dot", text:"connected"});

	        var id = node.presetid;

	        node.on("input", function( msg ) {

	        	var err, res;

	 			node.client.call(
	      			{"jsonrpc": "2.0", "method": "listDestinationsForPreset", "params": [id], "id": 1234},
	      			function (err, res) {
	          			// Did it all work ? 
	          			if (err) { console.log(`listdestinationsforpreset - Error on JSON-RPC call ${err}`); }
	          			else { 
	          				var msg = { 
	          					topic: "",
	          					payload: res,
	          					ip: node.addr,
	          					port: node.port 
	          				}; 
	          				console.log(`listdestinationsforpreset - success!` ); 
	          				node.send( msg);
	          			}
	          		}
	        	);
	     	});
        }

        node.on("close", function () {
			this.status({fill:"red", shape:"ring", text:"diconnected"});
        });
	}
	RED.nodes.registerType("listdestinationsforpreset", eventMasterListDestinationsForPreset);
	console.log("regstering listdestinationsforpreset");

	function eventMasterActivatePreset( n ) {

		RED.nodes.createNode(this, n);

		var node = this;

  		node.addr = n.addr;
		node.port = n.port;
		node.presetid = n.presetid || -1;
		node.presettype = n.presettype || 0;


		console.log(`activatepreset id= ${node.presetid}, type= ${node.presettype})`);

		if (node.addr== "") {
            node.warn("EventMaster: ip address not set");
        } else if (node.port == 0) {
            node.warn("EventMaster: port not set");
        } else if (isNaN(node.port) || (node.port < 1) || (node.port > 65535)) {
            node.warn("EventMaster: port number not valid");
        } else if (node.presetid < 1) {
        	node.warn("EventMaster: preset Id not valid");
        } else {
       
			var options = {
					host: '127.0.0.1',
					port: 5858,
					path: '/',
					strict: true
				};
			options.host = node.addr;
			options.port = node.port;

			node.client = new rpc.Client(options);

	        this.status({fill:"green", shape:"dot", text:"connected"});

	        node.on("input", function( msg ) {

	        	var err, res;
	       		var id = node.presetid;
	       		var type = node.presettype;

	       		if( msg.topic ) {
	       			if( msg.topic == "eventmaster/activatepreset/preview") {
						id = msg.payload;
						type = -1;
					} else if(msg.topic == "eventmaster/activatepreset/program") {
						id = msg.payload;
						type = 0;
					}
				} 

	 			node.client.call(
	      			{"jsonrpc": "2.0", "method": "activatePreset", "params": [id,type], "id": 1234},
	      			function (err, res) {
	          			// Did it all work ? 
	          			if (err) { console.log(`activatePreset - Error on JSON-RPC call ${err}`); }
	          			else { 
	          				var msg = { 
	          					topic: "",
	          					payload: res,
	          					ip: node.addr,
	          					port: node.port 
	          				}; 
	          				console.log(`activatePreset - success!` ); 
	          				node.send( msg);
	          			}
	          		}
	        	);
	     	});
        }

        node.on("close", function () {
			this.status({fill:"red", shape:"ring", text:"diconnected"});
        });
	}
	RED.nodes.registerType("activatepreset", eventMasterActivatePreset);
    console.log("registered activatepreset");
	
	function eventMasterAllTrans( n ) {

		RED.nodes.createNode(this, n);

		var node = this;

  		node.addr = n.addr;
		node.port = n.port;
	    
		console.log(`allTrans`);

		if (node.addr== "") {
            node.warn("EventMaster: ip address not set");
        } else if (node.port == 0) {
            node.warn("EventMaster: port not set");
        } else if (isNaN(node.port) || (node.port < 1) || (node.port > 65535)) {
            node.warn("EventMaster: port number not valid");
        } else {
       
			var options = {
					host: '127.0.0.1',
					port: 5858,
					path: '/',
					strict: true
				};
			options.host = node.addr;
			options.port = node.port;

			node.client = new rpc.Client(options);

	        this.status({fill:"green", shape:"dot", text:"connected"});

	        node.on("input", function( msg ) {

	        	var err, res;
	    
	 			node.client.call(
	      			{"jsonrpc": "2.0", "method": "allTrans", "params": [], "id": 1234},
	      			function (err, res) {
	          			// Did it all work ? 
	          			if (err) { console.log(`allTrans - Error on JSON-RPC call ${err}`); }
	          			else { 
	          				var msg = { 
	          					topic: "",
	          					payload: res,
	          					ip: node.addr,
	          					port: node.port 
	          				}; 
	          				console.log(`allTrans - success!` ); 
	          				node.send( msg);
	          			}
	          		}
	        	);
	     	});
        }

        node.on("close", function () {
			this.status({fill:"red", shape:"ring", text:"diconnected"});
        });
	}
    RED.nodes.registerType("allTrans", eventMasterAllTrans);
    console.log("registered allTrans");

	function eventMasterCut( n ) {

		RED.nodes.createNode(this, n);

		var node = this;

  		node.addr = n.addr;
		node.port = n.port;

	    
		console.log(`allTrans`);

		if (node.addr== "") {
            node.warn("EventMaster: ip address not set");
        } else if (node.port == 0) {
            node.warn("EventMaster: port not set");
        } else if (isNaN(node.port) || (node.port < 1) || (node.port > 65535)) {
            node.warn("EventMaster: port number not valid");
        } else {
       
			var options = {
					host: '127.0.0.1',
					port: 5858,
					path: '/',
					strict: true
				};
			options.host = node.addr;
			options.port = node.port;

			node.client = new rpc.Client(options);

	        this.status({fill:"green", shape:"dot", text:"connected"});

	        node.on("input", function( msg ) {

	        	var err, res;
	    
	 			node.client.call(
	      			{"jsonrpc": "2.0", "method": "cut", "params": [], "id": 1234},
	      			function (err, res) {
	          			// Did it all work ? 
	          			if (err) { console.log(`cut - Error on JSON-RPC call ${err}`); }
	          			else { 
	          				var msg = { 
	          					topic: "",
	          					payload: res,
	          					ip: node.addr,
	          					port: node.port 
	          				}; 
	          				console.log(`cut - success!` ); 
	          				node.send( msg);
	          			}
	          		}
	        	);
	     	});
        }

        node.on("close", function () {
			this.status({fill:"red", shape:"ring", text:"diconnected"});
        });
	}
	RED.nodes.registerType("cut", eventMasterCut);
    console.log("registered cut");

/*
	function eventMasterDeletePreset( n ) {

		RED.nodes.createNode(this, n);

		var node = this;

  		node.addr = n.addr;
		node.port = n.port;
		node.presetid = n.presetid || -1;
		
		console.log(`deletepreset id= ${node.presetid}`);

		if (node.addr== "") {
            node.warn("EventMaster: ip address not set");
        } else if (node.port == 0) {
            node.warn("EventMaster: port not set");
        } else if (isNaN(node.port) || (node.port < 1) || (node.port > 65535)) {
            node.warn("EventMaster: port number not valid");
        } else if (node.id === -1) {
        	node.warn("EventMaster: preset Id not valid");
        } else {
       
			var options = {
					host: '127.0.0.1',
					port: 5858,
					path: '/',
					strict: true
				};
			options.host = node.addr;
			options.port = node.port;

			node.client = new rpc.Client(options);

	        this.status({fill:"green", shape:"dot", text:"connected"});

	        node.on("input", function( msg ) {

	        	var err, res;
	        	var id = node.presetid;

	 			node.client.call(
	      			{"jsonrpc": "2.0", "method": "deletePreset", "params": [id], "id": 1234},
	      			function (err, res) {
	          			// Did it all work ? 
	          			if (err) { console.log(`deletepreset - Error on JSON-RPC call ${err}`); }
	          			else { 
	          				var msg = { 
	          					topic: "",
	          					payload: res,
	          					ip: node.addr,
	          					port: node.port 
	          				}; 
	          				console.log(`deletepreset - success!` ); 
	          				node.send( msg);
	          			}
	          		}
	        	);
	     	});
        }

        node.on("close", function () {
			this.status({fill:"red", shape:"ring", text:"diconnected"});
        });
	}
	console.log("regstering deletepreset");
	RED.nodes.registerType("deletepreset", eventMasterDeletePreset);

	function eventMasterSavePreset( n ) {

		RED.nodes.createNode(this, n);

		var node = this;

  		node.addr = n.addr;
		node.port = n.port;
		node.presetid = n.presetid || -1;
		node.presettype = n.presettype || 0;
		node.presetName = n.presetName;
		node.screenDest = n.screenDestination;
		
		console.log(`deletepreset id= ${node.presetid}`);

		if (node.addr== "") {
            node.warn("EventMaster: ip address not set");
        } else if (node.port == 0) {
            node.warn("EventMaster: port not set");
        } else if (isNaN(node.port) || (node.port < 1) || (node.port > 65535)) {
            node.warn("EventMaster: port number not valid");
        } else {
       
			var options = {
					host: '127.0.0.1',
					port: 5858,
					path: '/',
					strict: true
				};
			options.host = node.addr;
			options.port = node.port;

			node.client = new rpc.Client(options);

	        this.status({fill:"green", shape:"dot", text:"connected"});

	        node.on("input", function( msg ) {

	        	var err, res;
	        	var id = node.presetid;

	 			node.client.call(
	      			{"jsonrpc": "2.0", "method": "deletePreset", "params": [id], "id": 1234},
	      			function (err, res) {
	          			// Did it all work ? 
	          			if (err) { console.log(`deletepreset - Error on JSON-RPC call ${err}`); }
	          			else { 
	          				var msg = { 
	          					topic: "",
	          					payload: res,
	          					ip: node.addr,
	          					port: node.port 
	          				}; 
	          				console.log(`deletepreset - success!` ); 
	          				node.send( msg);
	          			}
	          		}
	        	);
	     	});
        }

        node.on("close", function () {
			this.status({fill:"red", shape:"ring", text:"diconnected"});
        });
	}
	console.log("regstering deletepreset");
	RED.nodes.registerType("deletepreset", eventMasterDeletePreset);

	function eventMasterListDestinations( n ) {

		RED.nodes.createNode(this, n);

		var node = this;

  		node.addr = n.addr;
		node.port = n.port;
		node.type = n.type || 0;

		console.log(`listdestinations type= ${node.type})`);

		if (node.addr== "") {
            node.warn("EventMaster: ip address not set");
        } else if (node.port == 0) {
            node.warn("EventMaster: port not set");
        } else if (isNaN(node.port) || (node.port < 1) || (node.port > 65535)) {
            node.warn("EventMaster: port number not valid");
        } else if (node.id === -1) {
        	node.warn("EventMaster: preset Id not valid");
        } else {
       
			var options = {
					host: '127.0.0.1',
					port: 5858,
					path: '/',
					strict: true
				};
			options.host = node.addr;
			options.port = node.port;

			node.client = new rpc.Client(options);

	        this.status({fill:"green", shape:"dot", text:"connected"});

	        node.on("input", function( msg ) {

	        	var err, res;

	 			node.client.call(
	      			{"jsonrpc": "2.0", "method": "listDestinations", "params": [node.type], "id": 1234},
	      			function (err, res) {
	          			// Did it all work ? 
	          			if (err) { console.log(`listdestinations - Error on JSON-RPC call ${err}`); }
	          			else { 
	          				var msg = { 
	          					topic: "",
	          					payload: res,
	          					ip: node.addr,
	          					port: node.port 
	          				}; 
	          				console.log(`listdestinations - success!` ); 
	          				node.send( msg);
	          			}
	          		}
	        	);
	     	});
        }

        node.on("close", function () {
			this.status({fill:"red", shape:"ring", text:"diconnected"});
        });
	}
	console.log("regstering listdestinations");
	RED.nodes.registerType("listdestinations", eventMasterListDestinations);


	function eventMasterListSources( n ) {

		RED.nodes.createNode(this, n);

		var node = this;

  		node.addr = n.addr;
		node.port = n.port;
		node.type = n.type || 0;

		console.log(`listsources type= ${node.type})`);

		if (node.addr== "") {
            node.warn("EventMaster: ip address not set");
        } else if (node.port == 0) {
            node.warn("EventMaster: port not set");
        } else if (isNaN(node.port) || (node.port < 1) || (node.port > 65535)) {
            node.warn("EventMaster: port number not valid");
        } else if (node.id === -1) {
        	node.warn("EventMaster: preset Id not valid");
        } else {
       
			var options = {
					host: '127.0.0.1',
					port: 5858,
					path: '/',
					strict: true
				};
			options.host = node.addr;
			options.port = node.port;

			node.client = new rpc.Client(options);

	        this.status({fill:"green", shape:"dot", text:"connected"});

	        node.on("input", function( msg ) {

	        	var err, res;

	 			node.client.call(
	      			{"jsonrpc": "2.0", "method": "listSources", "params": [node.type], "id": 1234},
	      			function (err, res) {
	          			// Did it all work ? 
	          			if (err) { console.log(`listsources - Error on JSON-RPC call ${err}`); }
	          			else { 
	          				var msg = { 
	          					topic: "",
	          					payload: res,
	          					ip: node.addr,
	          					port: node.port 
	          				}; 
	          				console.log(`listsources - success!` ); 
	          				node.send( msg);
	          			}
	          		}
	        	);
	     	});
        }

        node.on("close", function () {
			this.status({fill:"red", shape:"ring", text:"diconnected"});
        });
	}
	console.log("regstering listsources");
	RED.nodes.registerType("listsources", eventMasterListSources);


	function eventMasterListContent( n ) {

		RED.nodes.createNode(this, n);

		var node = this;

  		node.addr = n.addr;
		node.port = n.port;
		node.id = n.screeendestid || 0;

		console.log(`listcontent id= ${node.id})`);

		if (node.addr== "") {
            node.warn("EventMaster: ip address not set");
        } else if (node.port == 0) {
            node.warn("EventMaster: port not set");
        } else if (isNaN(node.port) || (node.port < 1) || (node.port > 65535)) {
            node.warn("EventMaster: port number not valid");
        } else if (node.id === -1) {
        	node.warn("EventMaster: preset Id not valid");
        } else {
       
			var options = {
					host: '127.0.0.1',
					port: 5858,
					path: '/',
					strict: true
				};
			options.host = node.addr;
			options.port = node.port;

			node.client = new rpc.Client(options);

	        this.status({fill:"green", shape:"dot", text:"connected"});

	        node.on("input", function( msg ) {

	        	var err, res;

	 			node.client.call(
	      			{"jsonrpc": "2.0", "method": "listContent", "params": [node.id], "id": 1234},
	      			function (err, res) {
	          			// Did it all work ? 
	          			if (err) { console.log(`listcontent - Error on JSON-RPC call ${err}`); }
	          			else { 
	          				var msg = { 
	          					topic: "",
	          					payload: res,
	          					ip: node.addr,
	          					port: node.port 
	          				}; 
	          				console.log(`listcontent - success!` ); 
	          				node.send( msg);
	          			}
	          		}
	        	);
	     	});
        }

        node.on("close", function () {
			this.status({fill:"red", shape:"ring", text:"diconnected"});
        });
	}
	console.log("regstering listcontent");
	RED.nodes.registerType("listcontent", eventMasterListContent);
*/
}
