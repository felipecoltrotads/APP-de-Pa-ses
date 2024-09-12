import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Image, SectionList, StyleSheet, Text, TextInput, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

type RootStackParamList = {
    Home: undefined;
    Details: { country: Country };
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

type Country = {
    cca3: string;
    name: {
        common: string;
        official: string;
    };
    capital: string[];
    continents: string[];
    flags: {
        png: string;
    };
}

type Section = {
    title: string;
    data: Country[];
}

const index = () => {

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 20
        },
        input: {
            padding: 10,
            borderWidth: 1,
            borderRadius: 5,
            marginBottom: 20
        },
        containerImagem: {
            flexDirection: 'row',
            marginVertical: 10
        },
        imagem: {
            width: 50,
            height: 30,
            marginRight: 10
        },
        header: {
            fontWeight: 'bold',
            fontSize: 18,
            marginVertical: 10
        }
    })

    const [countries, setCountries] = useState<Section[]>([])
    const [search, setSearch] = useState('')
    const navigation = useNavigation<NavigationProp>()

    useEffect(() => {
        axios.get<Country[]>('https://restcountries.com/v3.1/all').then(response => {
            const data = response.data
            const continents = [...new Set(data.map(country => country.continents[0]))]

            const sections: Section[] = continents.map(continents => ({
                title: continents,
                data: data.filter(country => country.continents[0] === continents),
            }))

            setCountries(sections)
        })
            .catch(error => console.error(error))
    }, [])


    const filteredCountries = countries.map(section => ({
        ...section,
        data: section.data.filter(country =>
            country.name.common.toLowerCase().includes(search.toLowerCase())
        )
    }))
    return (
        <View style={styles.container}>
            <TextInput style={styles.input} placeholder="Pesquise o país" value={search} onChangeText={setSearch} />
            <SectionList
                sections={filteredCountries} keyExtractor={(item, index) => item.cca3 + index}
                renderItem={({ item }) => (
                    <View style={styles.containerImagem} onTouchEnd={() => navigation.navigate('Details', { country: item })}>
                        <Image source={{ uri: item.flags.png }} style={styles.imagem} />
                        <View>
                            <Text>{item.name.common} - {item.capital}</Text>
                            <Text>{item.continents[0]}</Text>
                        </View>
                    </View>
                )}
                renderSectionHeader={({ section }) => (
                    <Text style={styles.header}>{section.title}</Text>
                )}
            />
        </View>
    )

}


export default index;