import { Inngest } from "inngest";
import dbConnect from "./db";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-ecommerce" });

//inngest to save user data to a database
export const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
  },
  {
    event: "clerk/user.created",
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    const userData = {
      _id: id,
      name: `${first_name} ${last_name}`,
      email: email_addresses[0].email_address,
      imageUrl: image_url,
    };

    await dbConnect();

    await User.create(userData);

    // try {
    //   await fetch("/api/user", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(userData),
    //   });
    // } catch (error) {
    //   console.error("Error syncing user data:", error);
    // }
  }
);

//inngest to update user
export const syncUserUpdate = inngest.createFunction(
  {
    id: "update-user-from-clerk",
  },
  {
    event: "clerk/user.updated",
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    const userData = {
      _id: id,
      name: `${first_name} ${last_name}`,
      email: email_addresses[0].email_address,
      imageUrl: image_url,
    };

    await dbConnect();

    await User.findByIdAndUpdate(id, userData);
  }
);

//inngest to delete user
export const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-from-clerk",
  },
  {
    event: "clerk/user.deleted",
  },
  async ({ event }) => {
    const { id } = event.data;

    await dbConnect();

    await User.findByIdAndDelete(id);
  }
);
