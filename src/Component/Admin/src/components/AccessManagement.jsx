import React, { useState } from 'react';
import './AccessManagement.css';

export default function AccessManagement() {
const [users, setUsers] = useState([]);
const [admins, setAdmins] = useState([]);
const [newUserId, setNewUserId] = useState('');
const [newAdminId, setNewAdminId] = useState('');

const toggleUserAccess = (id) => {
setUsers((current) =>
current.map((user) =>
user.id === id ? { ...user, enabled: !user.enabled } : user
)
);
};

const togglePermission = (id, permission) => {
setAdmins((current) =>
current.map((admin) =>
admin.id === id
? {
...admin,
permissions: {
...admin.permissions,
[permission]: !admin.permissions[permission],
},
}
: admin
)
);
};

const addUser = (event) => {
event.preventDefault();
const id = newUserId.trim();
if (!id || users.some((user) => user.id === id)) return;

setUsers((current) => [...current, { id, enabled: true }]);
setNewUserId('');

};

const addAdmin = (event) => {
event.preventDefault();
const id = newAdminId.trim();
if (!id || admins.some((admin) => admin.id === id)) return;

setAdmins((current) => [
  ...current,
  {
    id,
    permissions: {
      manageUsers: false,
      managePermissions: false,
      viewLogs: false,
    },
  },
]);
setNewAdminId('');

};

return (
<main className="access-management">
<header className="access-header">
<h2>Access Management</h2>
<p>Control account access and manage administrator permissions.</p>
</header>

  <section className="access-panel">
    <h3>User Access Control</h3>
    <p className="access-help">
      Add a user ID to manage whether their account is allowed access.
    </p>

    <form className="access-add-form" onSubmit={addUser}>
      <input
        aria-label="User ID"
        value={newUserId}
        onChange={(event) => setNewUserId(event.target.value)}
        placeholder="Enter user ID or email"
        required
      />
      <button type="submit">Add User</button>
    </form>

    {users.length === 0 ? (
      <p className="access-empty">No users added yet.</p>
    ) : (
      <div className="access-table-wrap">
        <table className="access-table">
          <thead>
            <tr>
              <th>User ID / Email</th>
              <th>Access Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  <span
                    className={`access-status ${
                      user.enabled ? 'enabled' : 'disabled'
                    }`}
                  >
                    {user.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </td>
                <td>
                  <button
                    type="button"
                    className={user.enabled ? 'access-disable' : 'access-enable'}
                    onClick={() => toggleUserAccess(user.id)}
                  >
                    {user.enabled ? 'Disable Access' : 'Enable Access'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </section>

  <section className="access-panel">
    <h3>Administrator Permissions</h3>
    <p className="access-help">
      Add an administrator and select the permissions they should have.
    </p>

    <form className="access-add-form" onSubmit={addAdmin}>
      <input
        aria-label="Administrator ID"
        value={newAdminId}
        onChange={(event) => setNewAdminId(event.target.value)}
        placeholder="Enter administrator ID or email"
        required
      />
      <button type="submit">Add Administrator</button>
    </form>

    {admins.length === 0 ? (
      <p className="access-empty">No administrators added yet.</p>
    ) : (
      <div className="access-table-wrap">
        <table className="access-table">
          <thead>
            <tr>
              <th>Administrator</th>
              <th>Manage Users</th>
              <th>Manage Permissions</th>
              <th>View Logs</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td>{admin.id}</td>
                {Object.entries(admin.permissions).map(([permission, allowed]) => (
                  <td key={permission}>
                    <label className="access-checkbox">
                      <input
                        type="checkbox"
                        checked={allowed}
                        onChange={() => togglePermission(admin.id, permission)}
                      />
                      {allowed ? 'Allowed' : 'Not allowed'}
                    </label>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </section>

  <p className="access-note">
    Note: These changes are currently stored in this page's temporary state.
    Connect the backend and enforce permissions on the server before using
    this page for real account security.
  </p>
</main>

);
}