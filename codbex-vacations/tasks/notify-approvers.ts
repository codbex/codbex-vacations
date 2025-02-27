import { configurations as config } from "sdk/core";
import { process } from "sdk/bpm"
import { sendMail } from "./mail-util"

const execution = process.getExecutionContext();
const executionId = execution.getId();

const requester = process.getVariable(executionId, "To");
const sender = process.getVariable(executionId, "From");
const requestId = process.getVariable(executionId, "RequestId");
const status = process.getVariable(executionId, "Status");

if (!status) {
    const managersEmail = config.get("LEAVE_REQUEST_MANAGERS_EMAIL", "managers-dl@example.com");

    const subject = "New leave request";

    const approvalLink = "http://localhost:8080/services/web/codbex-vacations/ext/generate/LeaveDeduction/leave-deduction-generate.html?id=" + requestId;

    const content = `<h4>A new leave request for [${requester}] has been created</h4>Open the inbox <a href="${approvalLink}" target="_blank">here</a> to process the request.`;

    console.log("Here notify approvers");

    sendMail(managersEmail, subject, content);
}
else {
    if (status === "Approved") {
        const managersEmail = config.get("LEAVE_REQUEST_EMPLOYEE_EMAIL", requester)

        const subject = "Leave Request Approved";

        const content = `<h4>Your leave request has been approved by ${sender}</h4>`;

        console.log("Here notify approvers");

        sendMail(managersEmail, subject, content);
    }
    if (status === "Rejected") {
        const managersEmail = config.get("LEAVE_REQUEST_EMPLOYEE_EMAIL", requester)

        const subject = "Leave Request Denied";

        const content = `<h4>Your leave request has been denied by ${sender}</h4>`;

        console.log("Here notify approvers");

        sendMail(managersEmail, subject, content);
    }
}