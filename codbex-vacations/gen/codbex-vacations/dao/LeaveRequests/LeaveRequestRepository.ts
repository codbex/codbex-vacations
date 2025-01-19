import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";
import { EntityUtils } from "../utils/EntityUtils";
// custom imports
import { NumberGeneratorService } from "/codbex-number-generator/service/generator";

export interface LeaveRequestEntity {
    readonly Id: number;
    Number?: string;
    Employee?: number;
    Manager?: number;
    StartDate?: Date;
    EndDate?: Date;
    Days?: number;
    Type?: number;
    Status?: number;
    Reason?: string;
    ApprovalDate?: Date;
}

export interface LeaveRequestCreateEntity {
    readonly Employee?: number;
    readonly Manager?: number;
    readonly StartDate?: Date;
    readonly EndDate?: Date;
    readonly Days?: number;
    readonly Type?: number;
    readonly Status?: number;
    readonly Reason?: string;
    readonly ApprovalDate?: Date;
}

export interface LeaveRequestUpdateEntity extends LeaveRequestCreateEntity {
    readonly Id: number;
}

export interface LeaveRequestEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Number?: string | string[];
            Employee?: number | number[];
            Manager?: number | number[];
            StartDate?: Date | Date[];
            EndDate?: Date | Date[];
            Days?: number | number[];
            Type?: number | number[];
            Status?: number | number[];
            Reason?: string | string[];
            ApprovalDate?: Date | Date[];
        };
        notEquals?: {
            Id?: number | number[];
            Number?: string | string[];
            Employee?: number | number[];
            Manager?: number | number[];
            StartDate?: Date | Date[];
            EndDate?: Date | Date[];
            Days?: number | number[];
            Type?: number | number[];
            Status?: number | number[];
            Reason?: string | string[];
            ApprovalDate?: Date | Date[];
        };
        contains?: {
            Id?: number;
            Number?: string;
            Employee?: number;
            Manager?: number;
            StartDate?: Date;
            EndDate?: Date;
            Days?: number;
            Type?: number;
            Status?: number;
            Reason?: string;
            ApprovalDate?: Date;
        };
        greaterThan?: {
            Id?: number;
            Number?: string;
            Employee?: number;
            Manager?: number;
            StartDate?: Date;
            EndDate?: Date;
            Days?: number;
            Type?: number;
            Status?: number;
            Reason?: string;
            ApprovalDate?: Date;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Number?: string;
            Employee?: number;
            Manager?: number;
            StartDate?: Date;
            EndDate?: Date;
            Days?: number;
            Type?: number;
            Status?: number;
            Reason?: string;
            ApprovalDate?: Date;
        };
        lessThan?: {
            Id?: number;
            Number?: string;
            Employee?: number;
            Manager?: number;
            StartDate?: Date;
            EndDate?: Date;
            Days?: number;
            Type?: number;
            Status?: number;
            Reason?: string;
            ApprovalDate?: Date;
        };
        lessThanOrEqual?: {
            Id?: number;
            Number?: string;
            Employee?: number;
            Manager?: number;
            StartDate?: Date;
            EndDate?: Date;
            Days?: number;
            Type?: number;
            Status?: number;
            Reason?: string;
            ApprovalDate?: Date;
        };
    },
    $select?: (keyof LeaveRequestEntity)[],
    $sort?: string | (keyof LeaveRequestEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface LeaveRequestEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<LeaveRequestEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface LeaveRequestUpdateEntityEvent extends LeaveRequestEntityEvent {
    readonly previousEntity: LeaveRequestEntity;
}

export class LeaveRequestRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_LEAVEREQUEST",
        properties: [
            {
                name: "Id",
                column: "LEAVEREQUEST_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Number",
                column: "LEAVEREQUEST_NUMBER",
                type: "VARCHAR",
            },
            {
                name: "Employee",
                column: "LEAVEREQUEST_EMPLOYEE",
                type: "INTEGER",
            },
            {
                name: "Manager",
                column: "LEAVEREQUEST_MANAGER",
                type: "INTEGER",
            },
            {
                name: "StartDate",
                column: "LEAVEREQUEST_STARTDATE",
                type: "DATE",
            },
            {
                name: "EndDate",
                column: "LEAVEREQUEST_ENDDATE",
                type: "DATE",
            },
            {
                name: "Days",
                column: "LEAVEREQUEST_DAYS",
                type: "INTEGER",
            },
            {
                name: "Type",
                column: "LEAVEREQUEST_TYPE",
                type: "INTEGER",
            },
            {
                name: "Status",
                column: "LEAVEREQUEST_STATUS",
                type: "INTEGER",
            },
            {
                name: "Reason",
                column: "LEAVEREQUEST_REASON",
                type: "VARCHAR",
            },
            {
                name: "ApprovalDate",
                column: "LEAVEREQUEST_APPROVALDATE",
                type: "DATE",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(LeaveRequestRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: LeaveRequestEntityOptions): LeaveRequestEntity[] {
        return this.dao.list(options).map((e: LeaveRequestEntity) => {
            EntityUtils.setDate(e, "StartDate");
            EntityUtils.setDate(e, "EndDate");
            EntityUtils.setDate(e, "ApprovalDate");
            return e;
        });
    }

    public findById(id: number): LeaveRequestEntity | undefined {
        const entity = this.dao.find(id);
        EntityUtils.setDate(entity, "StartDate");
        EntityUtils.setDate(entity, "EndDate");
        EntityUtils.setDate(entity, "ApprovalDate");
        return entity ?? undefined;
    }

    public create(entity: LeaveRequestCreateEntity): number {
        EntityUtils.setLocalDate(entity, "StartDate");
        EntityUtils.setLocalDate(entity, "EndDate");
        EntityUtils.setLocalDate(entity, "ApprovalDate");
        // @ts-ignore
        (entity as LeaveRequestEntity).Number = new NumberGeneratorService().generate(30);
        if (entity.Status === undefined || entity.Status === null) {
            (entity as LeaveRequestEntity).Status = 1;
        }
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_LEAVEREQUEST",
            entity: entity,
            key: {
                name: "Id",
                column: "LEAVEREQUEST_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: LeaveRequestUpdateEntity): void {
        // EntityUtils.setLocalDate(entity, "StartDate");
        // EntityUtils.setLocalDate(entity, "EndDate");
        // EntityUtils.setLocalDate(entity, "ApprovalDate");
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_LEAVEREQUEST",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "LEAVEREQUEST_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: LeaveRequestCreateEntity | LeaveRequestUpdateEntity): number {
        const id = (entity as LeaveRequestUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as LeaveRequestUpdateEntity);
            return id;
        } else {
            return this.create(entity);
        }
    }

    public deleteById(id: number): void {
        const entity = this.dao.find(id);
        this.dao.remove(id);
        this.triggerEvent({
            operation: "delete",
            table: "CODBEX_LEAVEREQUEST",
            entity: entity,
            key: {
                name: "Id",
                column: "LEAVEREQUEST_ID",
                value: id
            }
        });
    }

    public count(options?: LeaveRequestEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_LEAVEREQUEST"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: LeaveRequestEntityEvent | LeaveRequestUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-vacations-LeaveRequests-LeaveRequest", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-vacations-LeaveRequests-LeaveRequest").send(JSON.stringify(data));
    }
}
