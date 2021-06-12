import { LoginPge } from "../pages/login";
import { AddPost } from "../pages/posts";
import { AddComments } from "../pages/comments";

it("Home page should have the correct title", async () => {
    await LoginPge();
    await AddPost();
    await AddComments();
});