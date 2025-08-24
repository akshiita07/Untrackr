import React from "react";
import UserCard from "./UserCard";

const UserList = ({ users }) => {
    return (
        <div className="user-list">
            {users.map((user) => (
                <UserCard key={user.id} user={user} />
            ))}
        </div>
    );
};

export default UserList;
