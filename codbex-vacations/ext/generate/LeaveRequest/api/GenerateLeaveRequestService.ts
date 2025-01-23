import { Controller, Get } from "sdk/http";
import { user } from "sdk/security";

import { EmployeeRepository as EmployeeDao } from "codbex-employees/gen/codbex-employees/dao/Employees/EmployeeRepository";
import { JobAssignmentRepository as JobAssignmentDao } from "codbex-jobs/gen/codbex-jobs/dao/Employees/JobAssignmentRepository";
import { JobPositionRepository as JobPositionDao } from "codbex-jobs/gen/codbex-jobs/dao/Teams/JobPositionRepository";
import { TeamRepository as TeamDao } from "codbex-organizations/gen/codbex-organizations/dao/Teams/TeamRepository";

@Controller
class GenerateLeaveRequestService {

    private readonly employeeDao;
    private readonly jobAssignmentDao;
    private readonly jobPositionDao;
    private readonly teamDao;

    constructor() {
        this.employeeDao = new EmployeeDao();
        this.jobAssignmentDao = new JobAssignmentDao();
        this.jobPositionDao = new JobPositionDao();
        this.teamDao = new TeamDao();
    }

    @Get("/Employee")
    public getLoggedEmployee() {

        const employees = this.employeeDao.findAll({
            $filter: {
                equals: {
                    Email: user.getName()
                }
            }
        });

        return { "Employee": employees[0].Id }
    }

    @Get("/Manager")
    public getEmployeeManager() {

        const employees = this.employeeDao.findAll({
            $filter: {
                equals: {
                    Email: user.getName()
                }
            }
        });

        const jobAssignments = this.jobAssignmentDao.findAll({
            $filter: {
                equals: {
                    Employee: employees[0].Id
                }
            }
        });

        const jobPositions = this.jobPositionDao.findAll({
            $filter: {
                equals: {
                    Id: jobAssignments[0].JobPosition
                }
            }
        });

        const teams = this.teamDao.findAll({
            $filter: {
                equals: {
                    Id: jobPositions[0].Team
                }
            }
        });

        return { "Manager": teams[0].Manager }
    }

}