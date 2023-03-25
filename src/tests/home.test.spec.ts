import { test } from "@playwright/test";

import { LoginPge } from "../pages/login";
import { AddPost } from "../pages/posts";
import { AddComments } from "../pages/comments";

test("Home page should have the correct title", async ({page}) => {
    await LoginPge(page);
    await AddPost(page);
    await AddComments(page);
});