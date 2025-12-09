"use client";

import * as Progress from "@radix-ui/react-progress";
import { cn } from "@/lib/cn";
import { FiCheck, FiX } from "react-icons/fi";
import { PASSWORD_REQUIREMENTS } from "@/components/auth/schemas/register.schema";

interface PasswordStrengthProps {
  password?: string;
}

export function PasswordStrength({ password = "" }: PasswordStrengthProps) {
  const requirements = PASSWORD_REQUIREMENTS;

  const strength = requirements.reduce(
    (acc, req) => acc + (req.regex.test(password) ? 1 : 0),
    0
  );

  const progress = (strength / requirements.length) * 100;

  return (
    <div className="space-y-2 mt-2">
      <div className="flex justify-between text-sm">
        <span>Password strength</span>
        <span>{Math.round(progress)}%</span>
      </div>

      <Progress.Root
        className="relative h-2 w-full overflow-hidden rounded-full bg-muted-foreground/20"
        value={progress}
      >
        <Progress.Indicator
          className="h-full w-full flex-1 bg-brand transition-all duration-500 ease-in-out"
          style={{ transform: `translateX(-${100 - progress}%)` }}
        />
      </Progress.Root>

      <ul className="grid grid-cols-2 gap-1 list-none m-0 p-0">
        {requirements.map((req, i) => {
          const isMet = req.regex.test(password);
          return (
            <li
              key={i}
              className={cn(
                "text-xs flex items-center gap-1.5 transition-colors",
                isMet ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <div
                className={cn(
                  "size-4 rounded-full grid place-items-center shrink-0",
                  isMet ? "bg-success text-white" : "bg-muted-foreground/50"
                )}
                aria-hidden={true}
              >
                {isMet ? (
                  <FiCheck className="size-3" strokeWidth={3} />
                ) : (
                  <FiX className="size-3" strokeWidth={3} />
                )}
              </div>
              {req.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
