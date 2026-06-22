import { getTranslations } from "next-intl/server";

type Props = {
  name: string;
  sharedBy: string;
  vmName: string;
  acceptId: string;
  locale: string;
};

export async function ShareVMTemplate({
  name,
  sharedBy,
  vmName,
  acceptId,
  locale
}: Props) {
  const t = await getTranslations({ locale, namespace: "email.share_vm" });

  return (
    <div>
      <h1>{t("greeting", { name })}</h1>
      <p>{t("body", { vmName, sharedBy })}</p>
      <p>
        {t("accept_here")}
        <a href={`${process.env.BETTER_AUTH_URL}/vms/accept/${acceptId}`}>
          {t("accept")}
        </a>
      </p>
      <p>{t("expires")}</p>
      <p>{t("regards")}</p>
      <p>{t("team")}</p>
    </div>
  );
}
