/*******************************************************************************
 * Created by: Saarth Deshpande.
 * Copyright (c) 2020 Saarth Deshpande.
 * All rights reserved.
 ******************************************************************************/

import { Terminal } from "xterm";
import "xterm/css/xterm.css";

export class TerminalUI {
    constructor(socket) {
        this.terminal = new Terminal({cols: 124, rows: 10});
        /* You can make your terminals colorful :) */
        this.terminal.setOption("theme", {
            background: "#202B33",
            foreground: "#F5F8FA"
        });
        this.socket = socket;
        this.fileName = undefined;
    }

    /**
     * Attach event listeners for terminal UI and socket.io client
     */
    startListening() {
        this.terminal.onData(data => this.sendInput(data));
        this.socket.on("output", data => {
            // When there is data from PTY on server, print that on Terminal.
            this.terminal.write(data);
        });
        this.socket.on("disconnect", () => {
            this.sendInput(`rm -rf /app/terminal/*\r`)
            this.socket.disconnect()
        })
    }

    /**
     * Print something to terminal UI.
     */
    write(text) {
        this.terminal.write(text);
    }

    /**
     * Utility function to print new line on terminal.
     */
    prompt(url, name) {
        // this.terminal.write(`\r\n$ `);
        // this.sendInput(`rm () { [[ $1 =~ -(rf|fr) && $2 = / ]] && echo "are you stupid" || command rm "$@" ;}\r`)
        // this.sendInput(`export PS1="\\e[1;36mpict@SudoLMS>\\e[0m "\r`)
        // this.sendInput(`mkdir -p ${fileName.replace(fileName.substring(fileName.indexOf("_", fileName.indexOf("_") + 1)), '')}\r`)
        // this.sendInput(`cd ${fileName.replace(fileName.substring(fileName.indexOf("_", fileName.indexOf("_") + 1)), '')}\r`)
        this.sendInput(`curl ${url} -o ${name}\r`)
        // if (fileName.endsWith('.zip')) {
        //     this.sendInput(`unzip ${fileName}\r`)
        // }
        // this.sendInput(`useradd -e \`date -d "1 day" +"%Y-%m-%d"\` ${fileName.split('.')[0]}\r`)
        // this.sendInput(`sudo -u ${fileName.split('.')[0]} bash\r`)
    }

    /**
     * Send whatever you type in Terminal UI to PTY process in server.
     * @param {*} input Input to send to server
     */


    sendInput(input) {
        this.socket.emit("input", input);
    }

    /**
     *
     * @param {HTMLElement} container HTMLElement where xterm can attach terminal ui instance.
     */
    attachTo(container, url, name) {
        this.terminal.open(container);
        // Default text to display on terminal.
        this.prompt(url, name);
    }

    closeConnection() {
        this.socket.emit("disconnect")
    }

    clear() {
        this.terminal.clear();
    }
}
