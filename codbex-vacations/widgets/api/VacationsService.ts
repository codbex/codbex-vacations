import { Controller, Get } from "sdk/http";
import { user } from "sdk/security";

import { EmployeeRepository as EmployeeDao } from "codbex-employees/gen/codbex-employees/dao/Employees/EmployeeRepository";
import { LeaveBalanceRepository as LeaveBalanceDao } from "codbex-vacations/gen/codbex-vacations/dao/LeaveBalance/LeaveBalanceRepository";


@Controller
class VacationsService {

    private readonly employeeDao;
    private readonly leaveBalanceDao;

    constructor() {
        this.employeeDao = new EmployeeDao();
        this.leaveBalanceDao = new LeaveBalanceDao();
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


        return {
            "RemainingLeave": remainingLeave
        };
    }

}