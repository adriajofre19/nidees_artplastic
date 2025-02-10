import Image from "next/image";

export default function ImpactSection() {
    return (
        <div className="relative h-[60vh] flex items-center justify-center">
            <Image
                src="/bolsas.png"
                alt="Nature"
                fill
                className="object-cover brightness-50"
            />
            <div className="relative text-center text-white px-4 max-w-4xl mx-auto">
                <h2 className="text-4xl font-light mb-6">Junts per un Futur Millor</h2>
                <p className="text-xl leading-relaxed">
                    Amb cada compra, estàs contribuint a un món més sostenible. Cada producte que
                    creem reutilitza aproximadament 5 bosses de plàstic, donant-los una nova vida
                    i evitant que acabin als nostres oceans i abocadors.
                </p>
                <p className="text-xl mt-4 leading-relaxed">
                    La teva elecció marca la diferència. Gràcies per formar part del canvi.
                </p>
            </div>
        </div>
    );
}