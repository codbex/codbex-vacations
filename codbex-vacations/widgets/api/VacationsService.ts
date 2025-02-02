import { Controller, Get } from "sdk/http";
import { user } from "sdk/security";

import { EmployeeRepository as EmployeeDao } from "codbex-employees/gen/codbex-employees/dao/Employees/EmployeeRepository";
import { LeaveBalanceRepository as LeaveBalanceDao } from "codbex-vacations/gen/codbex-vacations/dao/LeaveBalance/LeaveBalanceRepository";
import { LeaveRequestRepository as LeaveRequestDao } from "codbex-vacations/gen/codbex-vacations/dao/LeaveRequests/LeaveRequestRepository";


@Controller
class VacationsService {

    private readonly employeeDao;
    private readonly leaveBalanceDao;
    private readonly leaveRequestDao;

    constructor() {
        this.employeeDao = new EmployeeDao();
        this.leaveBalanceDao = new LeaveBalanceDao();
        this.leaveRequestDao = new LeaveRequestDao();
    }

    @Get("/User")
    public GetLoggedInUser() {

        const users = this.employeeDao.findAll({
            $filter: {
                equals: {
                    Email: user.getName()
                }
            }
        });

        const leaveBalances = this.leaveBalanceDao.findAll({
            $filter: {
                equals: {
                    Employee: users[0].Id
                }
            }
        });

        const remainingLeave = leaveBalances.reduce((sum, lb) => sum + lb.Balance, 0);

        const leaveRequests = this.leaveRequestDao.findAll({
            $filter: {
                equals: {
                    Employee: users[0].Id
                }
            }
        });

        return {
            "RemainingLeave": remainingLeave,
            "LeaveRequests": leaveRequests.length
        };
    }

}