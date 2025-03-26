import { process } from "sdk/bpm";
import { sendMail } from "./mail-util";

const execution = process.getExecutionContext();
const executionId = execution.getId();

const reciever = process.getVariable(executionId, "Employee");
const approver = process.getVariable(executionId, "Manager");

const subject = "Leave Request Denied";

const content = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color: #e74c3c;">Leave Request Denied</h2>
    <p>Hello ${reciever},</p>
    <p>We regret to inform you that your leave request has been denied by <strong>${approver}</strong>.</p>
    <p>If you have any concerns or need further clarification, please contact your manager.</p>
    <p>Best regards</p>
  </div>
`;

sendMail(reciever, subject, content);
