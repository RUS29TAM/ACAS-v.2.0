import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import ClientView from '@/components/ClientView/ClientView';

interface PageProps {
    params: Promise<{ clientId: string }>;
}

/*TODO удалить не используемые комментарии
*.next/types/app/clients/[clientId]/page.ts:34:29
Type error: Type 'PageProps' does not satisfy the constraint 'import("D:/WebStormProjects/client-management-app/.next/types/app/clients/[clientId]/page").PageProps'.
  Types of property 'params' are incompatible.
    Type '{ clientId: string; }' is missing the following properties from type 'Promise<any>': then, catch, finally, [Symbol.toStringTag]

  32 |
  33 | // Check the prop type of the entry function
> 34 | checkFields<Diff<PageProps, FirstArg<TEntry['default']>, 'default'>>()
     |                             ^
  35 |
  36 | // Check the arguments and return type of the generateMetadata function
  37 | if ('generateMetadata' in entry) {
Next.js build worker exited with code: 1 and signal: null
* */
export default async function ClientPage({ params }: PageProps) {
    const clientId = parseInt((await params).clientId);

    if (isNaN(clientId)) {
        return notFound();
    }

    const client = await prisma.client.findUnique({
        where: { id: clientId },
        include: { Center: { select: { name: true } } },
    });

    if (!client) {
        return notFound();
    }

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Информация о клиенте</h1>
            <ClientView client={client} />
        </div>
    );
}
