type Props = {
  name: string;
  sharedBy: string;
  vmName: string;
  acceptId: string;
};

export function ShareVMTemplate({ name, sharedBy, vmName, acceptId }: Props) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>
        You have been invited to the VM &quot;{vmName}&quot; by {sharedBy}.
      </p>
      <p>
        Accept the invite here:{" "}
        <a href={`${process.env.BETTER_AUTH_URL}/vms/accept/${acceptId}`}>
          Accept
        </a>
      </p>
      <p>You have 1 day to accept the invite.</p>
      <p>Best regards,</p>
      <p>TI-ICT VMs Team</p>
    </div>
  );
}
