import { Given, When, Then, setDefaultTimeout } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { fixture } from "../../hooks/pageFixture";

setDefaultTimeout(2 * 60 * 1000); // 2 хвилини

// Navigate to the app
Given('User navigates to the application', async function () {
    await fixture.page.goto(process.env.BASEURL || "http://localhost:3000");
    fixture.logger.info("Navigated to the application");
});

// Click login link (точний локатор через роль + текст)
Given('User click on the login link', async function () {
    const loginLink = fixture.page.getByRole('link', { name: 'Login' });
    await loginLink.click();
    fixture.logger.info("Clicked on login link");
});

// Enter username
Given('User enter the username as {string}', async function (username) {
    const usernameInput = fixture.page.locator("input[formcontrolname='username']");
    await usernameInput.fill(username); // fill краще, ніж type
    fixture.logger.info(`Entered username: ${username}`);
});

// Enter password
Given('User enter the password as {string}', async function (password) {
    const passwordInput = fixture.page.locator("input[formcontrolname='password']");
    await passwordInput.fill(password);
    fixture.logger.info("Entered password");
});

// Click login button (точний локатор через роль + текст)
When('User click on the login button', async function () {
    const loginButton = fixture.page.getByRole('button', { name: 'Login' });
    await loginButton.click();
    await fixture.page.waitForLoadState('networkidle'); // чекаємо повного завантаження
    fixture.logger.info("Clicked on login button and waited for load");
});

// Login success check
Then('Login should be success', async function () {
    const userButton = fixture.page.getByRole('button', { name: /.*User.*/ }); // або частковий текст
    await expect(userButton).toBeVisible();
    const userName = await userButton.textContent();
    console.log("Username: " + userName);
    fixture.logger.info("Username: " + userName);
});

// Login fail check
When('Login should fail', async function () {
    const failureMessage = fixture.page.locator("mat-error[role='alert']");
    await expect(failureMessage).toBeVisible();
    fixture.logger.info("Login failed message is visible");
});
