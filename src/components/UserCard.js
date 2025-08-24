import React from "react";

const UserCard = ({ user }) => {
    return (
        <div className={`user-card ${user.status === "Unfollowed" ? "unfollowed" : "following"}`}>
            <p>{user.name}</p>
            <span>{user.status}</span>
        </div>
    );
};

export default UserCard;
