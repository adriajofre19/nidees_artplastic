"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Instagram } from "lucide-react";

export default function AboutUsPage() {
    return (
        <div className="min-h-screen">


            {/* Our Story Section */}
            <section className="py-16 md:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-light mb-6">La Nostra Història</h2>
                            <div className="space-y-4 text-gray-600">
                                <p>
                                    NiDEES va néixer de la passió per l&apos;artesania i el compromís amb el medi ambient.
                                    Som un equip d&apos;artesans que va decidir fer front al problema dels residus plàstics
                                    d&apos;una manera creativa i sostenible.
                                </p>
                                <p>
                                    La nostra aventura va començar en un petit taller a Girona, on vam començar a
                                    experimentar amb diferents tècniques per transformar bosses de plàstic en
                                    productes útils i bonics.
                                </p>
                                <p>
                                    Avui, cada peça que creem és única i està feta a mà amb materials 100% reciclats,
                                    contribuint així a reduir l&apos;impacte ambiental mentre creem productes
                                    funcionals i estètics.
                                </p>
                            </div>
                        </div>
                        <div className="relative h-[400px] rounded-lg overflow-hidden">
                            <Image
                                src="/tienda.png"
                                alt="El nostre taller"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Fairs Section */}
            <section className="py-16 md:py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-light mb-12 text-center">Ens Trobaràs a les Fires</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="relative h-[300px] group">
                            <Image
                                src="https://images.unsplash.com/photo-1533900298318-6b8da08a523e"
                                alt="Fira d'Artesania"
                                fill
                                className="object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <div className="text-white text-center p-4">
                                    <h3 className="text-xl font-semibold mb-2">Fira d&apos;Artesania de Girona</h3>
                                    <p>Cada primer dissabte de mes</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative h-[300px] group">
                            <Image
                                src="https://images.unsplash.com/photo-1531058020387-3be344556be6"
                                alt="Mercat Setmanal"
                                fill
                                className="object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <div className="text-white text-center p-4">
                                    <h3 className="text-xl font-semibold mb-2">Mercat del Lleó</h3>
                                    <p>Tots els dimarts i dissabtes</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative h-[300px] group">
                            <Image
                                src="/tienda.png"
                                alt="Fires Especials"
                                fill
                                className="object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <div className="text-white text-center p-4">
                                    <h3 className="text-xl font-semibold mb-2">Fires Especials</h3>
                                    <p>Consulta el nostre calendari</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Impact Section */}
            <section className="py-16 md:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-light mb-6">El Nostre Impacte</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Cada producte que creem contribueix a reduir els residus plàstics i
                            conscienciar sobre la importància del reciclatge creatiu.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="p-6">
                            <div className="text-4xl font-bold text-emerald-600 mb-4">5000+</div>
                            <div className="text-gray-600">Bosses reciclades</div>
                        </div>
                        <div className="p-6">
                            <div className="text-4xl font-bold text-emerald-600 mb-4">1000+</div>
                            <div className="text-gray-600">Productes creats</div>
                        </div>
                        <div className="p-6">
                            <div className="text-4xl font-bold text-emerald-600 mb-4">500+</div>
                            <div className="text-gray-600">Clients satisfets</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Follow Us Section */}
            <section className="py-16 md:py-24 bg-emerald-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-light mb-6">Segueix-nos</h2>
                    <p className="text-gray-600 mb-8">
                        Descobreix el nostre dia a dia i les últimes creacions a Instagram
                    </p>
                    <Button
                        className="bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => window.open('https://www.instagram.com/nidees_artplastic/', '_blank')}
                    >
                        <Instagram className="h-5 w-5 mr-2" />
                        @nidees_artplastic
                    </Button>
                </div>
            </section>
        </div>
    );
}