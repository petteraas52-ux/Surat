import { errorMessages } from "@/constants/errorMessages";

export type ErrorDomain = keyof typeof errorMessages;
export type DomainErrorCode<D extends ErrorDomain> =
  keyof (typeof errorMessages)[D];

type GeneralErrorCode = keyof (typeof errorMessages)["general"];

export function getErrorMessage<D extends ErrorDomain>(
  domain: D,
  code: DomainErrorCode<D> | GeneralErrorCode
): string {
  const domainMessages = errorMessages[domain] as Record<string, string>;
  const generalMessages = errorMessages.general as Record<string, string>;

  const key = code as string;

  return domainMessages[key] ?? generalMessages[key] ?? generalMessages.UNKNOWN;
}
