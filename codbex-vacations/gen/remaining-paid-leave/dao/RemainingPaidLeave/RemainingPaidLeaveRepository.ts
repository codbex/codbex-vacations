import { Query, NamedQueryParameter } from "sdk/db";

export interface RemainingPaidLeave {
    readonly 'Employee': string;
    readonly 'Year': number;
    readonly 'Balance': number;
}

export interface RemainingPaidLeaveFilter {
    readonly 'Year?': number;
}

export interface RemainingPaidLeavePaginatedFilter extends RemainingPaidLeaveFilter {
    readonly "$limit"?: number;
    readonly "$offset"?: number;
}

export class RemainingPaidLeaveRepository {

    private readonly datasourceName?: string;

    constructor(datasourceName?: string) {
        this.datasourceName = datasourceName;
    }

    public findAll(filter: RemainingPaidLeavePaginatedFilter): RemainingPaidLeave[] {
        const sql = `
            SELECT Employee.EMPLOYEE_NAME as "Employee", LeaveBalance.LEAVEBALANCE_YEAR as "Year", LeaveBalance.LEAVEBALANCE_BALANCE as "Balance"
            FROM CODBEX_LEAVEBALANCE as LeaveBalance
              INNER JOIN CODBEX_EMPLOYEE Employee ON LeaveBalance.LEAVEBALANCE_EMPLOYEE=Employee.EMPLOYEE_ID
            WHERE LeaveBalance.LEAVEBALANCE_YEAR = :Year
            ${Number.isInteger(filter.$limit) ? ` LIMIT ${filter.$limit}` : ''}
            ${Number.isInteger(filter.$offset) ? ` OFFSET ${filter.$offset}` : ''}
        `;

        const parameters: NamedQueryParameter[] = [];
        parameters.push({
            name: `Year`,
            type: `INTEGER`,
            value: filter['Year'] !== undefined ?  filter['Year'] : `2025`
        });

        return Query.executeNamed(sql, parameters, this.datasourceName);
    }

    public count(filter: RemainingPaidLeaveFilter): number {
        const sql = `
            SELECT COUNT(*) as REPORT_COUNT FROM (
                SELECT Employee.EMPLOYEE_NAME as "Employee", LeaveBalance.LEAVEBALANCE_YEAR as "Year", LeaveBalance.LEAVEBALANCE_BALANCE as "Balance"
                FROM CODBEX_LEAVEBALANCE as LeaveBalance
                  INNER JOIN CODBEX_EMPLOYEE Employee ON LeaveBalance.LEAVEBALANCE_EMPLOYEE=Employee.EMPLOYEE_ID
                WHERE LeaveBalance.LEAVEBALANCE_YEAR = :Year
            )
        `;

        const parameters: NamedQueryParameter[] = [];
        parameters.push({
            name: `Year`,
            type: `INTEGER`,
            value: filter.Year !== undefined ?  filter.Year : `2025`
        });

        return Query.executeNamed(sql, parameters, this.datasourceName)[0].REPORT_COUNT;
    }

}