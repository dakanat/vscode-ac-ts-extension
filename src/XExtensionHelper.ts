import * as vscode from "vscode";
import * as fs from "fs";
import child_process, { ExecFileSyncOptions } from "child_process";
import { acts } from "./AcTsExtension";

class XExtensionHelper {
    checkLang(chkkey: string): void {
        // check
        const config = vscode.workspace.getConfiguration(acts.appid);
        const cmdchk = String(config.get(chkkey));
        acts.channel.appendLine(`[${acts.timestamp()}] checker: ${cmdchk}`);
        const cmdexp = acts.expandString(cmdchk);
        const command = `(${cmdexp}) 1> ${acts.tmptestoutfile} 2> ${acts.tmptesterrfile}`;
        const options = { cwd: acts.projectpath };
        try {
            child_process.execSync(command, options);
        } catch (ex) {
            const err = fs.readFileSync(acts.tmptesterrfile).toString().trim().replace(/\n/g, "\r\n");
            throw `ERROR: check failed\r\n${err}\r\n`;
        }
    }

    compileTask(cmpkey: string, exeky: string): void {
        // compile
        const config = vscode.workspace.getConfiguration(acts.appid);
        const cmdcmp = String(config.get(cmpkey));
        acts.channel.appendLine(`[${acts.timestamp()}] compiler: ${cmdcmp}`);
        const cmdexp = acts.expandString(cmdcmp);
        const command = `(${cmdexp}) 1> ${acts.tmptestoutfile} 2> ${acts.tmptesterrfile}`;
        const options = { cwd: acts.projectpath };
        try {
            child_process.execSync(command, options);
        } catch (ex) {
            const err = fs.readFileSync(acts.tmptesterrfile).toString().trim().replace(/\n/g, "\r\n");
            throw `ERROR: compile failed\r\n${err}\r\n`;
        }

        // show executor
        const cmdexe = String(config.get(exeky));
        acts.channel.appendLine(`[${acts.timestamp()}] executor: ${cmdexe}`);
    }

    testTask(exekey: string): any {
        // test
        const config = vscode.workspace.getConfiguration(acts.appid);
        const cmdexe = String(config.get(exekey));
        const cmdexp = acts.expandString(cmdexe);
        const command = `(${cmdexp}) < ${acts.tmptestinfile} 1> ${acts.tmptestoutfile} 2> ${acts.tmptesterrfile}`;
        const options = { cwd: acts.projectpath };
        const child = child_process.exec(command, options);
        return child;
    }
}
export const xexthelper = new XExtensionHelper();
