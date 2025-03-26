import { process } from "sdk/bpm";
import { sendMail } from "./mail-util";

const execution = process.getExecutionContext();
const executionId = execution.getId();

const reciever = process.getVariable(executionId, "Manager");
let approvalLink = process.getVariable(executionId, "ApprovalLink");

const subject = "New Leave Request";

const processInstanceId = execution.getProcessInstanceId()

approvalLink = `${approvalLink}&processId=${processInstanceId}`;

const content = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color: #2c3e50;">New Leave Request</h2>
    <p>Hello ${reciever},</p>
    <p>A new leave request has been created and is pending your review.</p>
    <p>Click the button below to open your inbox and process the request:</p>
    <a href="${approvalLink}" target="_blank" style="
      display: inline-block;
      padding: 10px 20px;
      margin: 20px 0;
      font-size: 16px;
      color: #fff;
      background-color: #3498db;
      text-decoration: none;
      border-radius: 5px;">Review Request</a>
    <p>Thank you!</p>
  </div>
`;

sendMail(reciever, subject, content);
