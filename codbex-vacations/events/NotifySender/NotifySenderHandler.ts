import { process } from "sdk/bpm";
import { EmployeeRepository } from "codbex-employees/gen/codbex-employees/dao/Employees/EmployeeRepository";
import { LeaveStatusRepository } from "codbex-vacations/gen/codbex-vacations/dao/entities/LeaveStatusRepository";

export const trigger = (event) => {

    const EmployeeDao = new EmployeeRepository();
    const LeaveStatusDao = new LeaveStatusRepository();

    if (event.operation === "update") {
        const leaveRequest = event.entity;

        const employee = EmployeeDao.findById(leaveRequest.Employee);
        const manager = EmployeeDao.findById(leaveRequest.Manager);
        const status = leaveRequest.Status

        const statusName = LeaveStatusDao.findById(status).Name;

        const processInstanceId = process.start("approve-request", {
            From: manager.Email,
            To: employee.Email,
            Status: statusName
        });

        if (processInstanceId == null) {
            console.log("Failed to create opportunity action process!");
            return;
        }
    }
}