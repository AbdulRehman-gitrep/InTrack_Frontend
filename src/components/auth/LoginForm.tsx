"use client"

import { useState } from "react"
import { Check, Eye, EyeOff, Lock, Mail } from "lucide-react"

import Brand from "@/components/common/Brand"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex min-h-screen w-full">
      {/* Left: Brand Panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-[#020817] p-12 lg:flex lg:w-[45%]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(37,99,235,0.08),transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative">
          <Brand variant="sidebar" centered={false} />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-slate-400">
            Manage interns, assign tasks, monitor daily updates, and streamline
            the complete internship lifecycle from one centralized platform.
          </p>

          <div className="mt-10 space-y-4">
            {[
              "Role Based Management",
              "Daily Progress Tracking",
              "Feedback & Weekly Reports",
            ].map((text) => (
              <div key={text} className="flex items-center gap-3">
                <div className="flex size-7 items-center justify-center rounded-full bg-blue-600/20">
                  <Check className="size-3.5 text-blue-400" />
                </div>
                <span className="text-sm text-slate-300">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-slate-600">© 2026 InTrack</p>
      </div>

      {/* Right: Form Panel */}
      <div className="flex w-full items-center justify-center bg-white px-6 py-12 lg:w-[55%]">
        <Card className="w-full max-w-[440px] border border-slate-200 shadow-lg">
          <CardHeader className="p-8 pb-0">
            {/* Mobile brand */}
            <div className="mb-6 lg:hidden">
              <Brand centered={false} subtitle="" />
            </div>

            <div className="mb-4 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
              Welcome Back
            </div>

            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
              Sign in to your account
            </CardTitle>
            <p className="mt-1.5 text-sm text-slate-500">
              Enter your enterprise credentials to continue.
            </p>
          </CardHeader>

          <CardContent className="p-8 pt-6">
            <form className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="intern@company.com"
                    className="h-10 pl-10"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-10 pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  className="size-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                Remember me
              </label>

              {/* Submit */}
              <Button
                type="submit"
                className="h-12 w-full bg-gradient-to-r from-blue-600 to-blue-500 text-base font-semibold shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg hover:from-blue-700 hover:to-blue-600"
              >
                Sign In
              </Button>
            </form>

            {/* Divider */}
            <div className="relative mt-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-slate-400">OR</span>
              </div>
            </div>

            <p className="mt-6 text-center text-xs leading-relaxed text-slate-400">
              Only organization-issued accounts can access InTrack.
              <br />
              Contact your administrator if you need assistance.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
