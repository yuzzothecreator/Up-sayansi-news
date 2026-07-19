import { describe, expect, it } from "vitest";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "@/lib/validators/auth";

const validPassword = "Password123";

describe("signUpSchema", () => {
  it("accepts valid sign-up input", () => {
    const result = signUpSchema.safeParse({
      name: "Alex Morgan",
      email: "alex@pulse.app",
      password: validPassword,
      confirmPassword: validPassword,
    });

    expect(result.success).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    const result = signUpSchema.safeParse({
      name: "Alex Morgan",
      email: "alex@pulse.app",
      password: validPassword,
      confirmPassword: "Different123",
    });

    expect(result.success).toBe(false);
  });

  it("rejects weak passwords", () => {
    const result = signUpSchema.safeParse({
      name: "Alex Morgan",
      email: "alex@pulse.app",
      password: "password",
      confirmPassword: "password",
    });

    expect(result.success).toBe(false);
  });
});

describe("signInSchema", () => {
  it("accepts valid credentials", () => {
    const result = signInSchema.safeParse({
      email: "reader@pulse.app",
      password: "secret",
    });

    expect(result.success).toBe(true);
  });

  it("requires a password", () => {
    const result = signInSchema.safeParse({
      email: "reader@pulse.app",
      password: "",
    });

    expect(result.success).toBe(false);
  });
});

describe("forgotPasswordSchema", () => {
  it("requires a valid email", () => {
    expect(
      forgotPasswordSchema.safeParse({ email: "reader@pulse.app" }).success,
    ).toBe(true);
    expect(forgotPasswordSchema.safeParse({ email: "not-an-email" }).success).toBe(
      false,
    );
  });
});

describe("resetPasswordSchema", () => {
  it("requires matching passwords and a token", () => {
    const result = resetPasswordSchema.safeParse({
      token: "reset-token",
      password: validPassword,
      confirmPassword: validPassword,
    });

    expect(result.success).toBe(true);
  });
});

describe("changePasswordSchema", () => {
  it("requires current password and matching new password", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "OldPassword123",
      newPassword: validPassword,
      confirmPassword: validPassword,
    });

    expect(result.success).toBe(true);
  });
});
