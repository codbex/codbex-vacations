import { EmployeeRepository } from "codbex-employees/gen/codbex-employees/dao/Employees/EmployeeRepository";

import { process } from "sdk/bpm";
import { request } from "sdk/http";

export const trigger = (event) => {

    const EmployeeDao = new EmployeeRepository();

    if (event.operation === "create") {
        const leaveRequest = event.entity;

        const employee = EmployeeDao.findById(leaveRequest.Employee);
        const manager = EmployeeDao.findById(leaveRequest.Manager);
        const requestId = leaveRequest.Id;

        const protocol = request.getScheme() + "://";
        const domain = request.getHeader("Host")

        const approvalLink = `${protocol}${domain}/services/web/codbex-vacations/ext/generate/LeaveDeduction/leave-deduction-generate.html?id=${requestId}`;

        const processInstanceId = process.start("vacation-approval-request", {
            Employee: employee.Email,
            Manager: manager.Email,
            ApprovalLink: approvalLink
        });

        if (processInstanceId == null) {
            throw new Error("Failed to send mail to manager action process!");
        }
    }
}