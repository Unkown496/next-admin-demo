import HelloButton from '@components/HelloButton/HelloButton';
import FormExample from '@components/FormExample/FormExampleContainer';

export default function Page() {
  return (
    <div className="h-[100vh] flex flex-col items-center gap-2 justify-center">
      <h1>Next-Admin app</h1>
      <HelloButton />

      <h2>Example server actions</h2>
      <p>Admin update form</p>

      <FormExample />
    </div>
  );
}
