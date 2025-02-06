import { Controller, Get } from "sdk/http";
import { user } from "sdk/security";

import { LeaveBalanceRepository as LeaveBalanceDao } from "codbex-vacations/gen/codbex-vacations/dao/LeaveBalance/LeaveBalanceRepository";
import { EmployeeRepository as EmployeeDao } from "codbex-employees/gen/codbex-employees/dao/Employees/EmployeeRepository";

@Controller
class ViewLeaveBalancesService {

    private readonly leaveBalanceDao;
    private readonly employeeDao;


    constructor() {
        this.leaveBalanceDao = new LeaveBalanceDao();
        this.employeeDao = new EmployeeDao();
    }

    @Get("/LeaveBalancesData")
    public getLeaveBalances() {

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

        return {
            "LeaveBalances": leaveBalances
        };

    }

}
