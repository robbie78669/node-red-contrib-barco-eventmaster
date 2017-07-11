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
	var rpc = require('json-rpc2');

	function eventMasterListPresets( n ) {

		RED.nodes.createNode(this, n);

		var node = this;

  		node.addr = n.addr;
  		node.port = n.port;

		node.screenDest = n.srcdest || -1;
		node.auxDest = n.auxdest || -1;

		if (node.addr== "") {
            node.warn("EventMaster: ip address not set");
        } else if (node.port == 0) {
            node.warn("EventMaster: port not set");
        } else if (isNaN(node.port) || (node.port < 1) || (node.port > 65535)) {
            node.warn("EventMaster: port number not valid");
        } else {
       
			node.client = rpc.Client.$create(node.port, node.addr);

	        this.status({fill:"green", shape:"dot", text:"connected"});

	        node.on("input", function( msg ) {

		        	node.client.call( 'listPresets', [{"ScreenDest": node.screenDest, "AuxDest" : node.AuxDest }],
	      			function (err, res) {
	          			// Did it work ? 
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
	RED.nodes.registerType("presets", eventMasterListPresets);

	function eventMasterActivatePreset( n ) {

		RED.nodes.createNode(this, n);

		var node = this;

  		node.addr = n.addr;
		node.port = n.port;
		node.presetid = n.presetid || -1;
		node.presettype = n.presettype || 0;


		if (node.addr== "") {
            node.warn("EventMaster: ip address not set");
        } else if (node.port == 0) {
            node.warn("EventMaster: port not set");
        } else if (isNaN(node.port) || (node.port < 1) || (node.port > 65535)) {
            node.warn("EventMaster: port number not valid");
        } else if (node.presetid < 1) {
        	node.warn("EventMaster: preset Id not valid");
        } else {
       
			node.client = rpc.Client.$create(node.port, node.addr);

	        this.status({fill:"green", shape:"dot", text:"connected"});

	        node.on("input", function( msg ) {

	        	var err, res;
	       		var id = node.presetid;
	       		var type = node.presettype;

	       		if( msg.topic ) {
	       			if( msg.topic.indexof("preview") != -1) {
						id = msg.payload;
						type = -1;
					} else if(msg.topic.indexof("program") != -1) {
						id = msg.payload;
						type = 0;
					}
				} 

	 			node.client.call('activatePreset', [id,type],
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
    //console.log("registered activatepreset");
	
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
       
			node.client = rpc.Client.$create(node.port, node.addr);

	        this.status({fill:"green", shape:"dot", text:"connected"});

	        node.on("input", function( msg ) {

	        	var err, res;
	    
	 			node.client.call('allTrans', [], 
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
    
	function eventMasterCut( n ) {

		RED.nodes.createNode(this, n);

		var node = this;

  		node.addr = n.addr;
		node.port = n.port;

		if (node.addr== "") {
            node.warn("EventMaster: ip address not set");
        } else if (node.port == 0) {
            node.warn("EventMaster: port not set");
        } else if (isNaN(node.port) || (node.port < 1) || (node.port > 65535)) {
            node.warn("EventMaster: port number not valid");
        } else {
 
			node.client = rpc.Client.$create(node.port, node.addr);

	        this.status({fill:"green", shape:"dot", text:"connected"});

	        node.on("input", function( msg ) {

	        	var err, res;
	    
	 			node.client.call('cut', [], 
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
    
	function eventMasterListDestinations( n ) {

		RED.nodes.createNode(this, n);

		var node = this;

  		node.addr = n.addr;
		node.port = n.port;
		node.type = n.desttype || 0;

		if (node.addr== "") {
            node.warn("EventMaster: ip address not set");
        } else if (node.port == 0) {
            node.warn("EventMaster: port not set");
        } else if (isNaN(node.port) || (node.port < 1) || (node.port > 65535)) {
            node.warn("EventMaster: port number not valid");
        } else {
       
			node.client = rpc.Client.$create(node.port, node.addr);

	        this.status({fill:"green", shape:"dot", text:"connected"});

	        node.on("input", function( msg ) {

	        	var err, res;

	 			node.client.call('listDestinations', [node.type],
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
	//console.log("registered listdestinations");
	RED.nodes.registerType("destinations", eventMasterListDestinations);


	function eventMasterListSources( n ) {

		RED.nodes.createNode(this, n);

		var node = this;

  		node.addr = n.addr;
		node.port = n.port;
		node.type = n.sourcetype || 0;
	
		if (node.addr== "") {
            node.warn("EventMaster: ip address not set");
        } else if (node.port == 0) {
            node.warn("EventMaster: port not set");
        } else if (isNaN(node.port) || (node.port < 1) || (node.port > 65535)) {
            node.warn("EventMaster: port number not valid");
        } else {
       
			node.client = rpc.Client.$create(node.port, node.addr);

	        this.status({fill:"green", shape:"dot", text:"connected"});

	        node.on("input", function( msg ) {

	        	var err, res;

	 			node.client.call('listSources', [node.type],
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
	//console.log("registered listsources");
	RED.nodes.registerType("sources", eventMasterListSources);
}
