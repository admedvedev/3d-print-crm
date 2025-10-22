import { getPasswordStrength } from "@/lib/validation";
import { Check, X } from "lucide-react";

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null;

  const { score, message, isValid } = getPasswordStrength(password);

  const getScoreColor = (score: number) => {
    if (score <= 1) return "text-red-500";
    if (score <= 2) return "text-orange-500";
    if (score <= 3) return "text-yellow-500";
    if (score <= 4) return "text-blue-500";
    return "text-green-500";
  };

  const getScoreWidth = (score: number) => {
    return `${(score / 5) * 100}%`;
  };

  return (
    <div className="mt-2 space-y-2">
      {/* Индикатор силы пароля */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Сила пароля:</span>
          <span className={`font-medium ${getScoreColor(score)}`}>
            {score}/5
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              score <= 1 ? "bg-red-500" :
              score <= 2 ? "bg-orange-500" :
              score <= 3 ? "bg-yellow-500" :
              score <= 4 ? "bg-blue-500" : "bg-green-500"
            }`}
            style={{ width: getScoreWidth(score) }}
          />
        </div>
      </div>

      {/* Сообщение о требованиях */}
      <div className="text-xs">
        {isValid ? (
          <div className="flex items-center gap-1 text-green-600">
            <Check className="h-3 w-3" />
            <span>{message}</span>
          </div>
        ) : (
          <div className="flex items-start gap-1 text-red-600">
            <X className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <span>{message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
