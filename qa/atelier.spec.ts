import { test, expect } from "@playwright/test";
test("draw coordinates, fill, persist gallery and require adult gate", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page.getByRole("button", { name: "Vamos brincar →" }).click();
  await page.getByRole("button", { name: "Desenhos para colorir" }).click();
  await page.getByRole("button", { name: "Colorir Gatinho curioso" }).click();
  const canvas = await page.getByTestId("drawing-canvas").boundingBox();
  expect(canvas).not.toBeNull();
  const box = canvas!;
  expect(Math.abs(box.width - box.height)).toBeLessThan(2);
  await page.mouse.move(box.x + box.width * 0.3, box.y + box.height * 0.4);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.7, box.y + box.height * 0.5, {
    steps: 10,
  });
  await page.mouse.up();
  await page.getByRole("button", { name: "◒ Colorir", exact: true }).click();
  await page.getByRole("button", { name: "Azul", exact: true }).click();
  await page.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.72);
  await page.getByRole("button", { name: "✓ Guardar desenho" }).click();
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("@breda/atelier/gallery/v1")!),
  );
  expect(saved[0].fills.body).toBe("#45ADCD");
  expect(Math.abs(saved[0].strokes[0].points[0].x - 300)).toBeLessThan(5);
  expect(Math.abs(saved[0].strokes[0].points[0].y - 400)).toBeLessThan(5);
  await page.getByRole("button", { name: "Ver minha galeria" }).click();
  await expect(
    page.getByRole("button", { name: "Abrir desenho 1" }),
  ).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Vamos brincar →" }).click();
  await page.getByRole("button", { name: "Minha galeria" }).click();
  await expect(
    page.getByRole("button", { name: "Abrir desenho 1" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "← Início" }).click();
  await page.getByRole("button", { name: "Área de responsáveis" }).click();
  await page.getByRole("textbox", { name: "Resposta da conta" }).fill("0");
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await expect(
    page.getByText("Essa resposta não confere.", { exact: false }),
  ).toBeVisible();
  const text = await page.locator("body").innerText(),
    m = text.match(/(\d+) \+ (\d+) = \?/)!;
  await page
    .getByRole("textbox", { name: "Resposta da conta" })
    .fill(String(Number(m[1]) + Number(m[2])));
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await expect(
    page.getByText("Gerenciar galeria", { exact: true }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("direct parents URL never bypasses the gate", async ({ page }) => {
  await page.goto("/parents");
  await page.getByRole("button", { name: "Vamos brincar →" }).click();
  await expect(
    page.getByRole("button", { name: "Área de responsáveis" }),
  ).toBeVisible();
  await expect(
    page.getByText("Gerenciar galeria", { exact: true }),
  ).toHaveCount(0);
  await expect(page).toHaveURL(/\/$/);
});
