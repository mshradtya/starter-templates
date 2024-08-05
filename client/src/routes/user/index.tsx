import UsersTable from "./UsersTable";
import RegisterUser from "./RegisterUser";
import useFetchUsers from "@/hooks/user/useFetchUsers";

const Users: React.FC = () => {
  const { users, loading, fetchUsers } = useFetchUsers();

  return (
    <div>
      <div className="flex justify-end mb-4">
        <RegisterUser fetchUsers={fetchUsers} />
      </div>
      <UsersTable users={users} loading={loading} onRefresh={fetchUsers} />
    </div>
  );
};

export default Users;
