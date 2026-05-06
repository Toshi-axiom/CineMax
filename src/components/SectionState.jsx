import React from "react";

export function InlineLoader({ label = "Loading..." }) {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="flex items-center gap-3 text-neutral-300">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
        <span>{label}</span>
      </div>
    </div>
  );
}

export function InlineError({ message, onRetry, retryLabel = "Try Again" }) {
  return (
    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center">
      <p className="text-sm text-red-200">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-md bg-red-500/80 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500"
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}

export function InlineEmpty({ title, description }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-8 text-center">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {description && <p className="mt-2 text-sm text-neutral-400">{description}</p>}
    </div>
  );
}

