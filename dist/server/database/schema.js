/* eslint-disable */ /** auto generated, do not edit */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get customTimestamptz () {
        return customTimestamptz;
    },
    get escapeLiteral () {
        return escapeLiteral;
    },
    get fileAttachment () {
        return fileAttachment;
    },
    get fileAttachmentArray () {
        return fileAttachmentArray;
    },
    get tasks () {
        return tasks;
    },
    get tasksTable () {
        return tasksTable;
    },
    get userProfile () {
        return userProfile;
    },
    get userProfileArray () {
        return userProfileArray;
    }
});
const _drizzleorm = require("drizzle-orm");
const _pgcore = require("drizzle-orm/pg-core");
const customTimestamptz = (0, _pgcore.customType)({
    dataType (config) {
        const precision = typeof config?.precision !== 'undefined' ? ` (${config.precision})` : '';
        return `timestamptz${precision}`;
    },
    toDriver (value) {
        if (value == null) return value;
        if (typeof value === 'number') return new Date(value).toISOString();
        if (typeof value === 'string') return value;
        if (value instanceof Date) return value.toISOString();
        throw new Error('Invalid timestamp value');
    },
    fromDriver (value) {
        if (value instanceof Date) return value;
        return new Date(value);
    }
});
const userProfile = (0, _pgcore.customType)({
    dataType () {
        return 'user_profile';
    },
    toDriver (value) {
        return (0, _drizzleorm.sql)`ROW(${value})::user_profile`;
    },
    fromDriver (value) {
        const [userId] = value.slice(1, -1).split(',');
        return userId.trim();
    }
});
const fileAttachment = (0, _pgcore.customType)({
    dataType () {
        return 'file_attachment';
    },
    toDriver (value) {
        return (0, _drizzleorm.sql)`ROW(${value.bucket_id},${value.file_path})::file_attachment`;
    },
    fromDriver (value) {
        const [bucketId, filePath] = value.slice(1, -1).split(',');
        return {
            bucket_id: bucketId.trim(),
            file_path: filePath.trim()
        };
    }
});
function escapeLiteral(str) {
    return "'" + str.replace(/'/g, "''") + "'";
}
const userProfileArray = (0, _pgcore.customType)({
    dataType () {
        return 'user_profile[]';
    },
    toDriver (value) {
        if (!value || value.length === 0) {
            return (0, _drizzleorm.sql)`'{}'::user_profile[]`;
        }
        const elements = value.map((id)=>`ROW(${escapeLiteral(id)})::user_profile`).join(',');
        return _drizzleorm.sql.raw(`ARRAY[${elements}]::user_profile[]`);
    },
    fromDriver (value) {
        if (!value || value === '{}') return [];
        const inner = value.slice(1, -1);
        const matches = inner.match(/\([^)]*\)/g) || [];
        return matches.map((m)=>m.slice(1, -1).split(',')[0].trim());
    }
});
const fileAttachmentArray = (0, _pgcore.customType)({
    dataType () {
        return 'file_attachment[]';
    },
    toDriver (value) {
        if (!value || value.length === 0) {
            return (0, _drizzleorm.sql)`'{}'::file_attachment[]`;
        }
        const elements = value.map((f)=>`ROW(${escapeLiteral(f.bucket_id)},${escapeLiteral(f.file_path)})::file_attachment`).join(',');
        return _drizzleorm.sql.raw(`ARRAY[${elements}]::file_attachment[]`);
    },
    fromDriver (value) {
        if (!value || value === '{}') return [];
        const inner = value.slice(1, -1);
        const matches = inner.match(/\([^)]*\)/g) || [];
        return matches.map((m)=>{
            const [bucketId, filePath] = m.slice(1, -1).split(',');
            return {
                bucket_id: bucketId.trim(),
                file_path: filePath.trim()
            };
        });
    }
});
const tasks = (0, _pgcore.pgTable)("tasks", {
    id: (0, _pgcore.uuid)("id").primaryKey().defaultRandom(),
    title: (0, _pgcore.varchar)("title", {
        length: 255
    }).notNull(),
    priority: (0, _pgcore.varchar)("priority", {
        length: 20
    }).notNull().default('medium'),
    completed: (0, _pgcore.boolean)("completed").notNull().default(false),
    // System field: Creation time (auto-filled, do not modify)
    createdAt: customTimestamptz("_created_at", {
        precision: 3
    }).notNull().default((0, _drizzleorm.sql)`CURRENT_TIMESTAMP`),
    // System field: Creator (auto-filled, do not modify)
    createdBy: userProfile("_created_by").default((0, _drizzleorm.sql)`CASE
    WHEN (current_setting('app.user_id'::text, true) = ''::text) THEN NULL`),
    // System field: Update time (auto-filled, do not modify)
    updatedAt: customTimestamptz("_updated_at", {
        precision: 3
    }).notNull().default((0, _drizzleorm.sql)`CURRENT_TIMESTAMP`),
    // System field: Updater (auto-filled, do not modify)
    updatedBy: userProfile("_updated_by").default((0, _drizzleorm.sql)`CASE
    WHEN (current_setting('app.user_id'::text, true) = ''::text) THEN NULL`)
}, (table)=>[
        (0, _pgcore.index)("idx_tasks_priority").on(table.priority),
        (0, _pgcore.index)("idx_tasks_completed").on(table.completed),
        (0, _pgcore.index)("idx_tasks_created_at").on(table.createdAt)
    ]);
const tasksTable = tasks;
