import { Controller, Get } from "sdk/http";
import { user } from "sdk/security";

import { LeaveRequestRepository as LeaveRequestDao } from "codbex-vacations/gen/codbex-vacations/dao/LeaveRequests/LeaveRequestRepository";
import { LeaveStatusRepository as LeaveStatusDao } from "codbex-vacations/gen/codbex-vacations/dao/entities/LeaveStatusRepository";
import { LeaveTypeRepository as LeaveTypeDao } from "codbex-vacations/gen/codbex-vacations/dao/entities/LeaveTypeRepository";
import { EmployeeRepository as EmployeeDao } from "codbex-employees/gen/codbex-employees/dao/Employees/EmployeeRepository";

@Controller
class ViewLeaveRequestsService {

    private readonly leaveRequestDao;
    private readonly employeeDao;
    private readonly leaveStatusDao;
    private readonly leaveTypeDao;


    constructor() {
        this.leaveRequestDao = new LeaveRequestDao();
        this.employeeDao = new EmployeeDao();
        this.leaveStatusDao = new LeaveStatusDao();
        this.leaveTypeDao = new LeaveTypeDao();
    }

    @Get("/LeaveRequestsData")
    public getLeaveRequests() {

        const users = this.employeeDao.findAll({
            $filter: {
                equals: {
                    Email: user.getName()
                }
            }
        });

        const leaveRequests = this.leaveRequestDao.findAll({
            $filter: {
                equals: {
                    Employee: users[0].Id
                }
            }
        });

        leaveRequests.forEach((lr) => {
            lr.StartDate = new Date(lr.StartDate).toLocaleDateString("en-US");
            lr.EndDate = new Date(lr.EndDate).toLocaleDateString("en-US");
            lr.Status = this.leaveStatusDao.findById(lr.Status).Name;
            lr.Type = this.leaveTypeDao.findById(lr.Type).Name;
            if (lr.ResolvedAt) {
                lr.ResolvedAt = new Date(lr.ResolvedAt).toLocaleDateString("en-US");
            }
        });

        return {
            "LeaveRequests": leaveRequests
        };

    }

}